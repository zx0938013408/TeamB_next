"use client";
import "../../../styles/globals.css";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import Styles from "@/app/activity-list/activity-list.module.css";
import styles from "../../../styles/auth/member.module.css";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import moment from "moment";
import "@/public/TeamB_Icon/style.css";
import { AVATAR_PATH } from "../../../config/auth.api";
import ActivityCard from "../../../components/activity-list-card/ActivityCard"; // 顯示活動的卡片
import ActivityCardRegistered from "@/components/activity-list-card/ActivityCardRegistered";
import ActivityCardCreate from "@/components/activity-list-card/ActivityCardCreate";
import { MEMBER_ACTIVITIES } from "@/config/api-path"; // 已報名的 API 路徑
import { MEMBER_CREATED_ACTIVITIES } from "@/config/api-path"; // 已開團的 API 路徑
import { MEMBER_FAVORITES } from "@/config/api-path"; // 已收藏的 API 路徑
import { ACTIVITY_ADD_POST } from "@/config/activity-registered-api-path";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";



const isExpired = (activityTime) => {
  // 判斷活動時間是否已過
  return moment(activityTime).isBefore(moment(), "day"); // 判斷是否早於今天
};

const Member = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null); // 儲存用戶資料
  const [registeredActivities, setRegisteredActivities] = useState([]); // 儲存會員已報名的活動
  const [createdActivities, setCreatedActivities] = useState([]); // 儲存會員已開團的活動
  const [favoriteActivities, setFavoriteActivities] = useState([]); // 儲存會員已收藏的活動
  const [activeTab, setActiveTab] = useState("registered"); // 用來控制顯示的活動類型，默認顯示已報名活動
  const router = useRouter();
  const modalRef = useRef(null); // 新增：用來控制 modal 顯示的參考
  const bsModal = useRef(null); // 新增：用來初始化 bootstrap modal
  const [activityName, setActivityName] = useState(null); // 新增：活動名稱
  const [selectedPeople, setSelectedPeople] = useState(1); // 新增：選擇報名人數
  const [notes, setNotes] = useState(""); // 新增：備註
  const [loading, setLoading] = useState(false); // 新增：報名中狀態
  const [afterRegisterCallback, setAfterRegisterCallback] = useState(null);

  const openModal = (activity) => {
    setActivityName(activity); // 設置選擇的活動名稱
    if (bsModal.current) bsModal.current.show(); // 顯示 modal
  };

  const closeModal = () => {
    if (bsModal.current) bsModal.current.hide();  // 關閉 modal
  };

  const handleRegister = async () => {
    setLoading(true);

    if (!activityName || !activityName.al_id) {
        Swal.fire({
          icon: "warning",
          text: "請選擇活動",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });
      setLoading(false);
      return;
    }

    const formData = {
      member_id: auth.id,
      activity_id: activityName?.al_id,
      num: selectedPeople,
      notes: notes.trim(),
    };

    try {
      const response = await fetch(ACTIVITY_ADD_POST, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setNotes("");
        setSelectedPeople(1);
        if (typeof afterRegisterCallback === "function") {
          afterRegisterCallback(); // ✅ 子層的 setIsRegistered(true)
          setAfterRegisterCallback(null); // 清空，避免下次誤用
        }
        closeModal();
        fetchRegisteredActivities(auth.id);// 重新獲取已報名的活動資料
      }
    } catch (error) {
      console.error("報名失敗", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const bootstrap = require("bootstrap");
      if (modalRef.current) {
        bsModal.current = new bootstrap.Modal(modalRef.current); // 初始化 modal
      }
    }
  }, []);

  useEffect(() => {
    if (auth.id) {
      fetchRegisteredActivities(auth.id); // 獲取已報名的活動
      fetchCreatedActivities(auth.id); // 獲取已開團的活動
      fetchFavoriteActivities(auth.id); // 獲取已收藏的活動
    }
  }, [auth]);

  const fetchRegisteredActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已報名的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {}; // 解析 JWT 資料
      const token = auth.token; // 提取 token 部分
      console.log("JWT 令牌:", token); // 確認 JWT 是否正確獲取

      const response = await fetch(MEMBER_ACTIVITIES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`, // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      console.log('API 回應MEMBER_ACTIVITIES的資料:', data);  // 檢查資料是否正確
      if (data.success && data.activities) {
        setRegisteredActivities(
          [...data.activities].sort(
            (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
          )
        );
      } else {
        setRegisteredActivities([]); // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setRegisteredActivities([]); // 發生錯誤時設置空陣列
    }
  };

  const fetchCreatedActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已開團的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {}; // 解析 JWT 資料
      const token = auth.token; // 提取 token 部分

      const response = await fetch(MEMBER_CREATED_ACTIVITIES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`, // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      console.log('API 回應團主的資料:', data);  // 檢查資料是否正確
      if (data.success && data.activities) {
        setCreatedActivities(
          [...data.activities].sort(
            (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
          )
        ); // 設置已開團的活動資料
      } else {
        setCreatedActivities([]); // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取已開團活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setCreatedActivities([]); // 發生錯誤時設置空陣列
    }
  };

  const fetchFavoriteActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已收藏的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {}; // 解析 JWT 資料
      const token = auth.token; // 提取 token 部分

      const response = await fetch(MEMBER_FAVORITES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`, // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      console.log('API 回應的資料:', data);  // 檢查資料是否正確
      if (data.success && data.activities) {
        setFavoriteActivities(
          [...data.activities].sort(
            (a, b) => new Date(b.activity_time) - new Date(a.activity_time)
          )
        ); // 設置已收藏的活動資料
      } else {
        setFavoriteActivities([]); // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取已收藏的活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setFavoriteActivities([]); // 發生錯誤時設置空陣列
    }
  };

  if (!auth) return <p>載入中...</p>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* 側邊欄 */}
        <div className={styles.sidebar}>
          <Link href="/auth/member" className={styles.menuItem}>
            會員中心
          </Link>
          <Link href="/auth/member-edit" className={styles.menuItem}>
            編輯個人檔案
          </Link>
          <Link href="/auth/member-account" className={styles.menuItem}>
            帳號管理
          </Link>
          <Link href="/auth/orderHistory" className={styles.menuItem}>
            我的訂單
          </Link>
          <Link href="/auth/member-likes" className={styles.menuItem}>
            收藏商品
          </Link>
          <Link href="/auth/member-coupon" className={styles.menuItem}>我的優惠券</Link>
          <button
    className={styles.menuItemBtn}
    onClick={() => {
      logout();
      toast("會員已登出", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      router.push("/"); // 登出後導回首頁或登入頁
    }}
  >
    登出
  </button>
        </div>

        {/* 右側內容 */}
        <div className={styles.content}>
          <div className={styles.profileHeader}>
            {/* 會員的 Avatar */}
            <img
  src={
    auth?.avatar?.startsWith("http")
      ? auth.avatar // 如果是 http 開頭，代表是外部網址（例如 Google 頭貼）
      : `${AVATAR_PATH}/${auth?.avatar || "imgs/main.png"}` // 否則用內部預設圖
  }
  alt="User Avatar"
  className={styles.avatar}
/>
            <div className={styles.userInfo}>
              <h2>{auth?.name || "未命名使用者"}</h2>
              <p>
                生日：
                {auth?.birthday_date
                  ? moment(auth.birthday_date).format("YYYY-MM-DD")
                  : "未填寫"}
              </p>

              <p>喜愛運動：{auth?.sportText || "未填寫"}</p>
            </div>
          </div>

          {/* 分頁選單 */}
          <div className={styles.tabMenu}>
            <div className={styles.tabLeft}>
              <span
                className={`${styles.tabItem} ${
                  activeTab === "registered" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("registered")}
              >
                已報名
              </span>
              <span
                className={`${styles.tabItem} ${
                  activeTab === "created" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("created")}
              >
                已開團
              </span>
              <span
                className={`${styles.tabItem} ${
                  activeTab === "favorite" ? styles.active : ""
                }`}
                onClick={() => setActiveTab("favorite")}
              >
                已收藏
              </span>
            </div>
          </div>
          <hr />

          {/* 根據選中的活動類型顯示不同的活動 */}
          <div className={styles.tabContent}>
            {activeTab === "registered" &&
              (registeredActivities.length > 0 ? (
                registeredActivities.map((activity) => (
                  <ActivityCardRegistered
                    key={activity.registered_id}
                    activity={activity}
                    onQuickSignUp={(activity, onRegisteredCallback) => {
                      setActivityName(activity);
                      setAfterRegisterCallback(() => onRegisteredCallback); // 儲存子層傳來的 callback
                      if (bsModal.current) bsModal.current.show();
                    }}
                    onRefresh={() => fetchRegisteredActivities(auth.id)}
                    onLikeToggle={() => {
                      fetchRegisteredActivities(auth.id);
                      fetchCreatedActivities(auth.id);
                      fetchFavoriteActivities(auth.id);
                    }}
                    isExpired={isExpired(activity.activity_time)}
                  />
                ))
              ) : (
                <p>目前沒有已報名的活動。</p>
              ))}

            {activeTab === "created" &&
              (createdActivities.length > 0 ? (
                createdActivities.map((activity) => (
                  <ActivityCardCreate
                    key={activity.al_id}
                    activity={activity}
                    onLikeToggle={() => {
                      fetchRegisteredActivities(auth.id);
                      fetchCreatedActivities(auth.id);
                      fetchFavoriteActivities(auth.id);
                    }}
                    isExpired={isExpired(activity.activity_time)}
                    onQuickSignUp={openModal}
                  />
                ))
              ) : (
                <p>目前沒有已開團的活動。</p>
              ))}

            {activeTab === "favorite" &&
              (favoriteActivities.length > 0 ? (
                favoriteActivities.map((activity) => (
                  <ActivityCard
                    key={activity.al_id}
                    activity={activity}
                    fromFavorite={true}
                    onLikeToggle={() => {
                      fetchRegisteredActivities(auth.id);
                      fetchCreatedActivities(auth.id);
                      fetchFavoriteActivities(auth.id);
                    }}
                    isExpired={isExpired(activity.activity_time)}
                    onQuickSignUp={(activity, onRegisteredCallback) => {
                      openModal(activity); // 打開 modal
                      setAfterRegisterCallback(() => onRegisteredCallback); // 父層也要加 useState 儲存這個
                    }}
                  />
                ))
              ) : (
                <p>目前沒有已收藏的活動。</p>
              ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content bgc">
            <div className="modal-header">
              <h5 className={Styles.titleText} id="staticBackdropLabel">
                報名資訊
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className={`${Styles.title} row`}>
                <div className="titleIcons col-1">
                  {activityName?.sport_name === "籃球" ? (
                    <span
                      className={`icon-Basketball ${Styles.iconTitle}`}
                    ></span>
                  ) : activityName?.sport_name === "排球" ? (
                    <span
                      className={`icon-Volleyball ${Styles.iconTitle}`}
                    ></span>
                  ) : activityName?.sport_name === "羽球" ? (
                    <span
                      className={`icon-Badminton ${Styles.iconTitle}`}
                    ></span>
                  ) : null}
                </div>
                <h2 className={`${Styles.titleText} col`}>
                  {activityName?.activity_name}
                </h2>
                {/* 人數選擇 */}
                <div className={Styles.inputGroup}>
                  <div className={`${Styles.selectGroup} ${Styles.group1}`}>
                    <label htmlFor="people" className={`${Styles.peopleLabel}`}>
                      人數
                    </label>
                    <select
                      id="people"
                      name="people"
                      className={`${Styles.people}`}
                      value={selectedPeople} // ✅ 讓 `<select>` 綁定 `useState`
                      onChange={(e) =>
                        setSelectedPeople(Number(e.target.value))
                      } // ✅ 更新 `selectedPeople`
                    >
                      {activityName &&
                        Array.from(
                          { length: Math.min(4, activityName?.need_num - activityName?.registered_people) },
                          (_, i) => i + 1
                      ).map((num) => (
                          <option key={num} value={num}>
                            {num} 人
                          </option>
                      ))}
                    </select>
                  </div>
                  <input
                    className={`${Styles.inputPrice}`}
                    type="text"
                    name=""
                    id=""
                    value={`報名費用: 總計 ${
                      activityName?.payment
                        ? activityName?.payment * selectedPeople
                        : 0
                    } 元`}
                    disabled
                  />
                  <textarea
                    className={`${Styles.textareaInput}`}
                    name=""
                    id=""
                    placeholder="備註:ex 3男2女 (填)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="modal-footer">
                    <button
                      type="button"
                      className={Styles.cancel}
                      data-bs-dismiss="modal"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className={Styles.register}
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? "報名中..." : "確定報名"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Member;