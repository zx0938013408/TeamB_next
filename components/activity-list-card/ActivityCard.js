import Link from "next/link";
import Styles from "../../app/activity-list/activity-list.module.css";
import { useState } from "react";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";

export default function ActivityCard({ activity, onQuickSignUp }) {
  const imageUrl = `${AVATAR_PATH}${activity.avatar}`;
  console.log("最終圖片 URL:", imageUrl);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className={`${Styles.card} mx-auto`}>
      <div className={`${Styles.list} row`}>
      <div className={`${Styles.img} col-4`}>
      <div className={`${Styles.iconLikeStroke}`}>
    <LikeHeart />
    
  </div>
  <img
    src={activity.avatar ? `${AVATAR_PATH}${activity.avatar}` : `${AVATAR_PATH}TeamB-logo-greenYellow.png`}
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
        
        <div className={`col-2 d-flex flex-column align-items-end ${Styles.groupButton}`}>
        {/* 報名情況 */}
        <div className={`${Styles.registerInfo}`}> 
        <button type="button" className={Styles.registerInfoBtn}>
  <span className={Styles.number}>目前人數</span><br />
  <span className={Styles.total}>{activity.registered_people}/{activity.need_num}人</span>
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
  className={`${Styles.joinButton} ${Styles.joinInformation} ${activity.registered_people >= activity.need_num ? Styles.buttonDisabled : ''}`}
  onClick={() => {
    if (activity.registered_people < activity.need_num) {
      onQuickSignUp(activity); // 傳送活動資訊到上層
    }
  }}
  disabled={activity.registered_people >= activity.need_num}
>
  {activity.registered_people >= activity.need_num ? '已額滿' : '快速報名'}
</button>

  </div>
</div>
      </div>
    </div>
  );
}
