import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import ActivityEditModal from "@/components/activity-edit-modal/ActivityEditModal";
import RegisteredListModal from "@/components/activity-registered-num-modal/activity-registered-num-modal"
import { useState, useEffect } from "react";
import { API_SERVER } from "@/config/api-path";
import { MEMBER_DELETE_ACTIVITY } from "@/config/api-path";
import Swal from "sweetalert2"; // 引入 SweetAlert2


export default function ActivityCardCreate({ activity, onQuickSignUp, onLikeToggle }) {
  const [activityData, setActivityData] = useState(activity);

  // 查看報名情形
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // 取得當前日期
  const currentDate = new Date();
  const activityDate = new Date(activityData.activity_time);

  // 判斷活動是否過期
  const isExpired = activityDate < currentDate;

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSave = async (formData) => {
    const fd = new FormData();
    for (let key in formData) {
      fd.append(key, formData[key]);
    }

    try {
      const response = await fetch(`${API_SERVER}/members/${formData.al_id}`, {
        method: "PUT",
        body: fd,
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          icon: "success",
          text: "修改成功！",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });

        // 🔁 重新取得該活動資料並更新畫面
        const newRes = await fetch(
          `${API_SERVER}/members/activity/${formData.al_id}`
        );
        const newData = await newRes.json();

        if (newData.success) {
          setActivityData(newData.data);
        }
      } else {
        alert("修改失敗：" + result.error);
      }
    } catch (err) {
      console.error("❌ 修改活動失敗", err);
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = async () => {
    const { value: reason } = await Swal.fire({
      title: "請輸入取消此活動的原因",
      input: "text",
      inputPlaceholder: "請填寫原因...",
      showCancelButton: true,
      confirmButtonText: "送出",
      cancelButtonText: "取消",
      confirmButtonColor: "#29755D",
      didClose: () =>{
        document.body.style.overflow = ''
      },
      inputValidator: (value) => {
        if (!value) {
          return "必須填寫取消原因";
        }
        return null;
      },
    });
  
    if (!reason) return; // 使用者按取消

    try {
      const response = await fetch(
        `${API_SERVER}/members/${activityData.al_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancel_reason: reason }),
        }
      );

      const result = await response.json();
      if (result.success) {
        Swal.fire({
          icon: "success",
          text: "活動已取消，已通知報名者。",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });
        window.location.reload();
      } else {
        console.log("取消失敗：" + result.error);
      }
    } catch (err) {
      console.error("❌ 刪除活動失敗", err);
      console.log("發生錯誤，請稍後再試");
    }
  };

  return (
    <div
      className={`${Styles.card} mx-auto ${isExpired ? Styles.expired : ""}`}
    >
      {isExpired && <span className={Styles.expiredTag}>已過期</span>}
      <div className={`${Styles.list} row`}>
        <div className={`${Styles.img} col-sm-4`} style={{ position: 'relative' }}>
          <div className={`${Styles.iconLikeStroke}`}>
            <LikeHeart
              checked={activityData.is_favorite}
              activityId={activityData.al_id}
              onClick={onLikeToggle}
            />
          </div>
          <img
            src={
              activityData.avatar
                ? `${AVATAR_PATH}${activityData.avatar}`
                : `${AVATAR_PATH}TeamB-logo-greenYellow.png`
            }
            alt=""
            className={`${Styles.avatarImage}`}
          />
        </div>
        <div className={`${Styles.information} col-sm-6`}>
          <div className={`${Styles.title} row`}>
            <div className={`${Styles.titleIcons} col-1`}>
              {activityData.sport_name === "籃球" ? (
                <span className={`icon-Basketball ${Styles.iconTitle}`}></span>
              ) : activityData.sport_name === "排球" ? (
                <span className={`icon-Volleyball ${Styles.iconTitle}`}></span>
              ) : activityData.sport_name === "羽球" ? (
                <span className={`icon-Badminton ${Styles.iconTitle}`}></span>
              ) : null}
            </div>
            <h2 className={`${Styles.titleText} col`}>
              {activityData.activity_name}
            </h2>
          </div>
          <div className={`${Styles.info}`}>
            <p>
              <span className={`${Styles.infoTitle}`}>地  點：</span>
              <span>{activityData.court_name}</span>
              <a href="https://www.google.com/maps" target="_blank">
                <i className="fa-solid fa-location-dot" />
              </a>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>活動時間：</span>
              <span>{activityData.activity_time}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>報名期限：</span>
              <span>{activityData.deadline}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>費  用：</span>每人 
              <span>{activityData.payment}</span> 元
            </p>
          </div>
        </div>

        <div
          className={`col-sm-2 d-sm-flex flex-sm-column align-items-sm-end ${Styles.groupButton}`}
        >
          <div className={`${Styles.registerInfo}`}>
            <button 
              type="button" 
              className={Styles.joinButton}
              onClick={() => setShowRegisterModal(true)}
            >
              <span className={Styles.number}>目前人數</span>
              <br />
              <span>
                {activityData.registered_people}/{activityData.need_num}人
              </span>
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
            <Link
              href="/activity-list/[al_id]"
              as={`/activity-list/${activityData.al_id}`}
              onClick={() => {
                sessionStorage.setItem("scrollPosition", window.scrollY.toString());
                sessionStorage.setItem("fromPage", "/auth/member"); // ✅ 記住來源是會員頁
                sessionStorage.setItem("memberTab", "created");     // ✅ 也可以記住是開團分頁
              }}
            >
              <button type="button" className={Styles.joinButton}>
                查看詳情
              </button>
            </Link>
          </div>
          <div className={Styles.buttonWrapper}>
            <button
              type="button"
              className={Styles.joinButton}
              onClick={handleOpenModal}
            >
              活動修改
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
            <button
              type="button"
              className={`${Styles.joinButton} ${Styles.joinInformation} ${
                isExpired ? Styles.buttonDisabled : ""
              }`}
              onClick={() => {
                if (
                  !isExpired &&
                  activityData.registered_people < activityData.need_num
                ) {
                  // 呼叫父元件傳來的快速報名功能
                  if (typeof onQuickSignUp === "function") {
                    onQuickSignUp(activity);
                  }
                }
              }}
              disabled={
                isExpired ||
                activityData.registered_people >= activityData.need_num
              }
            >
              {isExpired
                ? "已過期"
                : activityData.registered_people >= activityData.need_num
                ? "已額滿"
                : "快速報名"}
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
            <button
              type="button"
              className={`${Styles.joinButton} ${Styles.deleteButton}`}
              onClick={handleDelete}
            >
              刪除活動
            </button>
          </div>
        </div>
      </div>
      {/* 顯示 Modal */}
      <ActivityEditModal
        showModal={showModal}
        activity={activity}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

      <RegisteredListModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        activityId={activityData.al_id}
      />
    </div>
  );
}
