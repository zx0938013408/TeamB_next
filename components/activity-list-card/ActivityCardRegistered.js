import React, { useState } from "react";
import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import { ACTIVITY_ITEM_PUT } from "@/config/activity-registered-api-path";
import { useAuth } from "@/context/auth-context";
import ActivityRegisteredEditModal from "@/components/activity-registered-edit-modal/activity-registered-edit-modal"
import Swal from "sweetalert2"; // 引入 SweetAlert2

export default function ActivityCardRegistered({
  activity,
  registeredId,
  onQuickSignUp,
  onLikeToggle,
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
        Swal.fire({
          icon: "success",
          title: "資料已更新成功",
          confirmButtonText: "確定",
          confirmButtonColor: "#4CAF50",
        });
        // setShowModal(false);
        // 如果有需要可重新 fetch 資料
      } else {
        Swal.fire({ icon: "error", title: "更新失敗", text: data.error });
      }
    } catch (error) {
      console.error("更新報名失敗", error);
      Swal.fire({ icon: "error", title: "錯誤", text: "伺服器錯誤" });
    }
  };

const openEditModal = async () => {
  try {
    const res = await fetch(ACTIVITY_ITEM_PUT(activity.registered_id)); // 🔥 `activity.id` 是 registered.id
    const data = await res.json();
    if (data.success) {
      setSelectedRegistration(data.data);
      setShowModal(true);
    }
  } catch (error) {
    console.error("取得報名資料失敗", error);
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
        <div className={`${Styles.img} col-4`}>
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
        <div className={`${Styles.information} col-6`}>
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
          className={`col-2 d-flex flex-column align-items-end ${Styles.groupButton}`}
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
