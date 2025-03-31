"use client";

import { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/public/TeamB_Icon/style.css";
import Styles from "./activity-list-detail.module.css";
import { AL_ITEM_GET,AVATAR_PATH,MESSAGE_BOARD_GET, MESSAGE_BOARD_POST,API_SERVER } from "@/config/api-path";
import { ACTIVITY_ADD_POST } from "@/config/activity-registered-api-path";
import LikeHeart from "@/components/like-hearts";
import { ST } from "next/dist/shared/lib/utils";
import { useAuth } from "@/context/auth-context";
import Swal from "sweetalert2"; // 引入 SweetAlert2


export default function ActivityDetailPage() {
  const { al_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const { auth } = useAuth(); // 獲取會員認證資料
  // 點擊圖片放大
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPeople, setSelectedPeople] = useState(1);
  const [notes, setNotes] = useState("");
  const modalRef = useRef(null);
  const bsModal = useRef(null);
  const [originalData, setOriginalData] = useState([]);
  const [listData, setListData] = useState([]);
  //留言板
  const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");


  // Modal
  useEffect(() => {
    if (typeof window !== "undefined") {
      const timer = setTimeout(() => {
        if (modalRef.current) {
          bsModal.current = new bootstrap.Modal(modalRef.current);
          console.log("✅ Modal 初始化成功");
        } else {
          console.warn("modalRef 還是 null");
        }
      }, 100); // 給它一點時間讓 DOM render 完
  
      return () => clearTimeout(timer);
    }
  }, []);

    const openModal = () => {
      if (bsModal.current) bsModal.current.show();
    };
    
    const closeModal = () => {
      if (bsModal.current) bsModal.current.hide();
    };


    // 新增報名資料至資料庫
    const fetchData = async () => {
      try {
        const userData = localStorage.getItem("TEAM_B-auth");
        const token = userData ? JSON.parse(userData).token : "";
    
        const r = await fetch(`${AL_ITEM_GET}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const obj = await r.json();
    
        if (obj.success) {
          setOriginalData(obj.rows);  // 儲存完整活動資料
          setListData(obj.rows);      // 顯示在畫面上的活動資料
        } else {
          console.warn("API 回傳失敗", obj);
        }
      } catch (error) {
        console.warn("fetchData 錯誤:", error);
      }
    };
    
    
    // ✅ 報名送出後可以使用
    const handleRegister = async () => {
      setLoading(true);
    
      if (!activity || !activity.al_id) {
        // 顯示 SweetAlert2 提示框
        Swal.fire({
          icon: "warning",
          text: "請選擇活動",  // 顯示後端回傳的訊息
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D", // 修改按鈕顏色
        });
        setLoading(false);
        return;
      }
    
      const formData = {
        member_id: auth.id,
        activity_id: activity?.al_id,
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
          // 顯示 SweetAlert2 提示框
          Swal.fire({
            icon: "success",
            text: "活動報名成功",  // 顯示後端回傳的訊息
            confirmButtonText: "確定",
            confirmButtonColor: "#29755D", // 修改按鈕顏色
          });
          closeModal();
          await fetchActivityDetail(); // 正確呼叫更新列表
        }
      } catch (error) {
        console.error("報名失敗", error);
      } finally {
        setLoading(false);
      }
    };

        // 初次載入資料
        useEffect(() => {
          fetchData();
        }, []);
      console.log("data:", listData);  // end Modal 報名

const fetchActivityDetail = async () => {
  if (!al_id) return;

  const apiUrl = `${AL_ITEM_GET}/${al_id}`;
  const userData = localStorage.getItem("TEAM_B-auth");
  const token = userData ? JSON.parse(userData).token : "";

  fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (res) => {
      const responseText = await res.text();
      try {
        return JSON.parse(responseText);
      } catch (error) {
        throw new Error("❌ API 回應的不是 JSON，可能是錯誤頁面");
      }
    })
    .then((data) => {
      if (data.success) {
        setActivity(data.data);
        const images = [
          data.data.avatar,
          data.data.avatar2,
          data.data.avatar3,
          data.data.avatar4,
        ].filter(Boolean);
        setImageList(images);
      }
    })
    .catch((error) => console.error("❌ fetch 錯誤:", error));
}

useEffect(() => {
  fetchActivityDetail();
}, [al_id]);

// 抓取留言資料
const fetchMessages = async () => {
  try {
    const res = await fetch(MESSAGE_BOARD_GET(al_id));
    const data = await res.json();
    if (data.success) {
      setMessages(data.messages);
    }
  } catch (err) {
    console.error("留言載入失敗:", err);
  }
};

// 發送留言功能
const handleAddMessage = async () => {
  if (!auth?.id || !newMessage.trim()) return;

  try {
    const res = await fetch(MESSAGE_BOARD_POST, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activity_id: al_id,
        member_id: auth.id,
        message: newMessage,
        is_owner: auth.id === activity?.founder_id
      }),
    });
    const data = await res.json();
    if (data.success) {
      setNewMessage("");
      fetchMessages();
    }else{
      Swal.fire({
        icon: "error",
        title: "留言失敗",
        text: data.error || "請稍後再試",
        confirmButtonText: "確定",
        confirmButtonColor: "#29755D",
      });
    }
  } catch (err) {
    console.error("留言發送失敗:", err);
    Swal.fire({
      icon: "error",
      title: "發送錯誤",
      text: "伺服器無回應或連線錯誤，請稍後再試。",
      confirmButtonText: "確定",
      confirmButtonColor: "#29755D",
    });
  }
};


useEffect(() => {
  if (al_id) fetchMessages();
}, [al_id]);



  if (!activity) {
    return <p className={Styles.loading}>載入中...</p>;
  }

  return (
    <>
      {/* 麵包屑 */}
      <div className={`${Styles.container} mx-auto ${Styles.bread}`}>
        <nav aria-label="breadcrumb">
          <ol className={Styles.breadcrumb}>
            <li className={Styles.notActive}>
              <a href="/activity-list" className={Styles.notActiveText}>
                回上一頁
              </a>
            </li>
          </ol>
        </nav>
      </div>

      <div className={`${Styles.container} mx-auto ${Styles.imgContainer}`}>
        {/* 左側圖片區 */}
        <div className={Styles.eventImages}>
  {/* 主圖：點擊可放大 */}
  <figure
  className={Styles.mainImage}
  onClick={() => {
  const index = imageList.findIndex((img) => img === activity.avatar);
  setCurrentIndex(index >= 0 ? index : 0);
  setSelectedImage(`${AVATAR_PATH}${activity.avatar}`);
  setShowLightbox(true);
}}
>
  <img
    src={
      activity.avatar
        ? `${AVATAR_PATH}${activity.avatar}`
        : `${AVATAR_PATH}/TeamB-logo-greenYellow.png`
    }
    alt="主圖"
    className={Styles.clickableImage}
  />
</figure>


  {/* 縮圖 */}
  <div className={Styles.thumbnailContainer}>
  {[activity.avatar2, activity.avatar3, activity.avatar4].map((img, i) => (
    <div key={i} className={Styles.thumbnail} onClick={() => {
  const index = imageList.findIndex((x) => x === img);
  setCurrentIndex(index);
  setSelectedImage(`${AVATAR_PATH}${img}`);
  setShowLightbox(true);
}}>
      <img
        src={
          img
            ? `${AVATAR_PATH}${img}`
            : `${AVATAR_PATH}/TeamB-logo-greenYellow.png`
        }
        alt={`縮圖 ${i + 1}`}
      />
    </div>
  ))}
</div>

</div>
        {/* 右側活動資訊 */}
        <div className={Styles.eventInfo}>
          <div className={`${Styles.title} row`}>
            <div className={`${Styles.titleIcons} col-1`}>
              {activity.sport_name === "籃球" ? (
                <span
                  className={`icon-Basketball ${Styles.titleIcon} col`}
                ></span>
              ) : activity.sport_name === "排球" ? (
                <span
                  className={`icon-Volleyball ${Styles.titleIcon} col`}
                ></span>
              ) : activity.sport_name === "羽球" ? (
                <span
                  className={`icon-Badminton ${Styles.titleIcon} col`}
                ></span>
              ) : null}
            </div>
            <h2 className={`${Styles.titleText} col`}>
              {activity.activity_name}
            </h2>
          </div>

          <div className={Styles.info}>
            <p>
              <strong>地&emsp;&emsp;點：</strong>
              {activity.court_name}{" "}
              <a href={`https://www.google.com/maps/search/?api=1&query=台南市${activity.court_name}`} target="_blank">
                <i className="fa-solid fa-location-dot"></i>
              </a>
            </p>
            <p>
              <strong>地&emsp;&emsp;址：</strong>
              {activity.address}
            </p>
            <p>
              <strong>活動時間：</strong> {activity.activity_time}
            </p>
            <p>
              <strong>報名期限：</strong> {activity.deadline}
            </p>
            <p>
              <strong>費&emsp;&emsp;用：</strong> {activity.payment} 元
            </p>
            <p>
              <strong>主&emsp;&emsp;辦：</strong> {activity.name}
            </p>

          {/* 報名情況 */}
            <p className="col">報名情況：
            <span>
            {activity.registered_people >= activity.need_num
            ? "人數已額滿"
            : Number(activity.registered_people) === 0
            ? "快來報名搶頭香"
            : `已報名 ${activity.registered_people} 人 / 需求人數 ${activity.need_num} 人`}
            </span>
            </p>
          </div>




          {/* 收藏與報名按鈕 */}
          <div className={`${Styles.eventActions} row`}>
            <button
              type="button"
              className={`${Styles.collect} col-2`}
              //onClick={toggleHeartStatus}
            >
              <span className={Styles.likeHeart}>
      <LikeHeart checked={activity.is_favorite} activityId={activity.al_id} />
              </span>
            </button>
            <button
              className={`${Styles.registerBtn} col ${activity.registered_people >= activity.need_num || new Date(activity.deadline) < new Date() ? Styles.buttonDisabled : ''}`}
              disabled={activity.registered_people >= activity.need_num || new Date(activity.deadline) < new Date()}
              onClick={() => {
                if (!auth?.id) {
                  // 顯示 SweetAlert2 提示框
                  Swal.fire({
                    icon: "warning",
                    text: "請先登入",  // 顯示後端回傳的訊息
                    confirmButtonText: "確定",
                    confirmButtonColor: "#29755D", // 修改按鈕顏色
                    timer: 1300, // 顯示 1.3 秒後自動關閉
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    didClose: () => {
                      window.location.href = "/auth/login"; // 或用 router.push
                    }
                  });
                  return;
                }
                openModal();
              }}
            >
              {activity.registered_people >= activity.need_num
              ? '已額滿'
              : new Date(activity.deadline) < new Date()
              ? '報名時間已截止'
              : '我要報名'}
            </button>          
            </div>
        </div>
      </div>

      {/* 活動詳情 */}
      <div className={`${Styles.container} mx-auto ${Styles.information}`}>
        <div className={Styles.information1}>
          <h2 className={Styles.infoTitle}>活動詳情</h2>
          <br />
          <p className={Styles.infoText}>{activity.introduction}</p>
        </div>
      </div>

      {/* 留言板 */}
      <div className={`${Styles.container} mx-auto ${Styles.information}`}>
  <div className={Styles.information1}>
    <h2 className={Styles.infoTitle}>活動留言板</h2>
    <div className={Styles.messageBoard}>
  {messages.map((msg) => (
    <div key={msg.id} className={Styles.messageItem}>
    {console.log("會員照片",msg.member_avatar)    }
      <img
        src={`${API_SERVER}${msg.member_avatar}`}
        alt="avatar"
        className={Styles.avatar}
      />
      <div>
        <div className={Styles.messageMeta}>
          <strong>{msg.member_name}</strong>
          {msg.is_owner && <span className={Styles.ownerTag}>主辦</span>}
          <span className={Styles.timestamp}>
            {new Date(msg.created_at).toLocaleString()}
          </span>
        </div>
        <p className={Styles.messageText}>{msg.message}</p>
      </div>
    </div>
  ))}
  {auth?.id && (
    <div className={Styles.newMessage}>
      <textarea
        value={newMessage}
        placeholder="輸入留言..."
        onChange={(e) => setNewMessage(e.target.value)}
        className={Styles.textareaInput}
      />
      <button onClick={handleAddMessage} className={Styles.register}>
        發送留言
      </button>
    </div>
  )}
</div>

  </div>
</div>


      {/* 商品推薦區 */}
      <div className={`${Styles.container} mx-auto ${Styles.advertise}`}>
        <h2 className={Styles.shopTitle}>中場休息 - 好物推薦</h2>
        <div className={`${Styles.shop} row`}>
          {/* 放入推薦商品（與首頁商品區相同) */}
          <div className={Styles.seeMore}>
            <a href="#">查看更多</a>
          </div>
        </div>
      </div>

      {showLightbox && (
  <div className={Styles.lightboxOverlay} onClick={() => setShowLightbox(false)}>
    <div className={Styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
    <button
        className={Styles.prevBtn}
        onClick={() => {
          const newIndex = (currentIndex - 1 + imageList.length) % imageList.length;
          setCurrentIndex(newIndex);
          setSelectedImage(`${AVATAR_PATH}${imageList[newIndex]}`);
        }}
      >
      &#8592;
      </button>

      <img src={selectedImage} alt="放大圖" />

      <button
        className={Styles.nextBtn}
        onClick={() => {
          const newIndex = (currentIndex + 1) % imageList.length;
          setCurrentIndex(newIndex);
          setSelectedImage(`${AVATAR_PATH}${imageList[newIndex]}`);
        }}
      >
        &#8594;
      </button>

      <button className={Styles.closeButton} onClick={() => setShowLightbox(false)}>
        &times;
      </button>
    </div>
  </div>
)}



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
          <div className={`${Styles.title} col-1`}>
          {activity?.sport_name === "籃球" ? (
              <span
                className={`icon-Basketball ${Styles.titleIcon}`}
              ></span>
            ) : activity?.sport_name === "排球" ? (
              <span
                className={`icon-Volleyball ${Styles.titleIcon}`}
              ></span>
            ) : activity?.sport_name === "羽球" ? (
              <span
                className={`icon-Badminton ${Styles.titleIcon}`}
              ></span>
            ) : null}
          </div>
          <h2 className={`${Styles.titleText} col`}>
            {activity?.activity_name}
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
                <option value={1}>1 人</option>
                <option value={2}>2 人</option>
                <option value={3}>3 人</option>
                <option value={4}>4 人</option>
              </select>
            </div>
            <input
              className={`${Styles.inputPrice}`}
              type="text"
              name=""
              id=""
              value={`報名費用: 總計 ${
                activity?.payment
                  ? activity?.payment * selectedPeople
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
  
}
