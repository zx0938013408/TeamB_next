import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import ActivityEditModal from "@/components/activity-edit-modal/ActivityEditModal";
import { useState } from "react";
import { API_SERVER } from "@/config/api-path";

export default function ActivityCardCreate({ activity, onQuickSignUp }) {
  // 取得當前日期
  const currentDate = new Date();
  const activityDate = new Date(activity.activity_time);

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
    console.log("📬 收到要送出的表單資料：", formData);

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
      console.log("✅ 後端回傳：", result);

      if (result.success) {
        alert("修改成功！");
      } else {
        alert("修改失敗：" + result.error);
      }
    } catch (err) {
      console.error("❌ 修改活動失敗", err);
    } finally {
      setShowModal(false);
    }
  };

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
                  activity.registered_people < activity.need_num
                ) {
                  // 呼叫父元件傳來的快速報名功能
                  if (typeof onQuickSignUp === "function") {
                    onQuickSignUp(activity);
                  }
                }
              }}
              disabled={
                isExpired || activity.registered_people >= activity.need_num
              }
            >
              {isExpired
                ? "已過期"
                : activity.registered_people >= activity.need_num
                ? "已額滿"
                : "快速報名"}
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
    </div>
  );
}
