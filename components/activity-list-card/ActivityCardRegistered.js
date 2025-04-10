import React, { useState } from "react";
import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import { ACTIVITY_ITEM_PUT } from "@/config/activity-registered-api-path";
import { useAuth } from "@/context/auth-context";
import ActivityRegisteredEditModal from "@/components/activity-registered-edit-modal/activity-registered-edit-modal"
import Swal from "sweetalert2"; // 引入 SweetAlert2
import { ACTIVITY_REGISTRATION_DELETE } from "@/config/activity-registered-api-path";


export default function ActivityCardRegistered({
  activity,
  registeredId,
  onQuickSignUp,
  onLikeToggle,
  onRefresh,
}) {
  // 取得當前日期
  const currentDate = new Date();
  const activityDate = new Date(activity.activity_time);
  const { auth } = useAuth(); // 獲取會員認證資料

  const [showModal, setShowModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  const handleModalSave = async ({ num, notes }) => {
    try {
      const res = await fetch(ACTIVITY_ITEM_PUT(activity.registered_id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registered_id: activity.registered_id,
          member_id: auth.id,
          num,
          notes,
        }),
      });
  
      const data = await res.json();
      if (data.success) {
        await Swal.fire({
          icon: "success",
          title: "資料已更新成功",
          confirmButtonText: "確定",
          confirmButtonColor: "#29755D",
          didClose: () =>{
            document.body.style.overflow = ''
          },
        });
        onRefresh();

      } else {
        await Swal.fire({ icon: "error", title: "更新失敗", text: data.error, didClose: () =>{
          document.body.style.overflow = ''
        }, });
      }
    } catch (error) {
      console.error("更新報名失敗", error);
      await Swal.fire({ icon: "error", title: "錯誤", text: "伺服器錯誤" , didClose: () =>{
        document.body.style.overflow = ''
      },});
    }
  };

const openEditModal = async () => {
  try {
    const res = await fetch(ACTIVITY_ITEM_PUT(activity.registered_id));
    const data = await res.json();
    if (data.success) {
      setSelectedRegistration(data.data);
      setShowModal(true);
    }
  } catch (error) {
    console.error("取得報名資料失敗", error);
  }
};

//取消報名按鈕功能
const handleCancel = async () => {
  const { value: reason } = await Swal.fire({
    title: "請輸入取消報名的原因",
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
        return "請填寫取消原因";
      }
      return null;
    },
  });

  try {
    const res = await fetch(ACTIVITY_REGISTRATION_DELETE(activity.registered_id), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cancel_reason: reason }),
    });

    const data = await res.json();

    if (data.success) {
      await Swal.fire({
        icon: "success",
        title: "已取消報名",
        confirmButtonText: "確定",
        confirmButtonColor: "#29755D",
        didClose: () =>{
          document.body.style.overflow = ''
        },
      });

      if (typeof onRefresh === "function") onRefresh();
    } else {
      await Swal.fire({ icon: "error", title: "取消失敗", text: data.error, didClose: () =>{
        document.body.style.overflow = ''
      }, });
    }
  } catch (error) {
    console.error("取消報名錯誤", error);
    await Swal.fire({ icon: "error", title: "錯誤", text: "伺服器錯誤", didClose: () =>{
      document.body.style.overflow = ''
    }, });
  }
};
  // 判斷活動是否過期
  const isExpired = activityDate < currentDate;

  console.log("API 拿到資料:",activity);

  return (
    <div
      className={`${Styles.card} mx-auto ${isExpired ? Styles.expired : ""}`}
    >
      {isExpired && <span className={Styles.expiredTag}>已過期</span>}
      <div className={`${Styles.list} row`}>
        <div className={`${Styles.img} col-sm-4`} style={{ position: 'relative' }}>
          <div className={`${Styles.iconLikeStroke}`}>
            <LikeHeart
              checked={activity.is_favorite}
              activityId={activity.al_id}
              onClick={onLikeToggle}
            />
          </div>
          <img
            src={
              activity.avatar
                ? `${AVATAR_PATH}${activity.avatar}`
                : `${AVATAR_PATH}TeamB-logo-greenYellow.png`
            }
            alt=""
            className={`${Styles.avatarImage}`}
          />
        </div>
        <div className={`${Styles.information} col-sm-6`}>
          <div className={`${Styles.title} row`}>
            <div className={`${Styles.titleIcons} col-1`}>
              {activity.sport_name === "籃球" ? (
                <span className={`icon-Basketball ${Styles.iconTitle}`}></span>
              ) : activity.sport_name === "排球" ? (
                <span className={`icon-Volleyball ${Styles.iconTitle}`}></span>
              ) : activity.sport_name === "羽球" ? (
                <span className={`icon-Badminton ${Styles.iconTitle}`}></span>
              ) : null}
            </div>
            <h2 className={`${Styles.titleText} col`}>
              {activity.activity_name}
            </h2>
          </div>
          <div className={`${Styles.info}`}>
            <p>
              <span className={`${Styles.infoTitle}`}>地  點：</span>
              <span>{activity.court_name}</span>
              <a href="https://www.google.com/maps" target="_blank">
                <i className="fa-solid fa-location-dot" />
              </a>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>活動時間：</span>
              <span>{activity.activity_time}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>報名期限：</span>
              <span>{activity.deadline}</span>
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>費  用：</span>每人 
              <span>{activity.payment}</span> 元
            </p>
            <p>
              <span className={`${Styles.infoTitle}`}>主  揪：</span>
              <span>{activity.name}</span>
            </p>
          </div>
        </div>

        <div
          className={`col-sm-2 d-sm-flex flex-sm-column align-items-sm-end ${Styles.groupButton}`}
        >
          <div className={`${Styles.registerInfo}`}>
            <button type="button" className={Styles.registerInfoBtn}>
              <span className={Styles.number}>目前人數</span>
              <br />
              <span className={Styles.total}>
                {activity.registered_people}/{activity.need_num}人
              </span>
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
            <Link
              href="/activity-list/[al_id]"
              as={`/activity-list/${activity.al_id}`}
              onClick={() => {
                sessionStorage.setItem("scrollPosition", window.scrollY.toString());
                sessionStorage.setItem("fromPage", "/auth/member"); // ✅ 記錄來自會員頁
                sessionStorage.setItem("memberTab", "registered");  // ✅ 回到「已報名」分頁
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
              className={`${Styles.joinButton} ${Styles.joinInformation} ${
                isExpired ? Styles.buttonDisabled : ""
              }`}
              onClick={openEditModal}
              disabled={
                isExpired || activity.registered_people >= activity.need_num
              }
            >
              {isExpired
                ? "已過期"
                : activity.registered_people >= activity.need_num
                ? "已額滿"
                : "報名修改"}
            </button>
          </div>
          <div className={Styles.buttonWrapper}>
  <button
    type="button"
    className={`${Styles.joinButton} ${Styles.deleteButton}`}
    onClick={handleCancel}
  >
    取消報名
  </button>
</div>

        </div>
      </div>

      {/* 顯示 Modal */}
      <ActivityRegisteredEditModal
        activity={activity}
        registration={selectedRegistration}
        onSave={handleModalSave}
      />
    </div>

  );
}
