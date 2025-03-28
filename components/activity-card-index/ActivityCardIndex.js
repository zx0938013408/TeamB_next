import Link from "next/link";
import Styles from "../../app/activity-list/activity-card-index.module.css";
import { useState } from "react";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH } from "@/config/api-path";
import { useAuth } from "@/context/auth-context";

export default function ActivityCardIndex({ activity, onQuickSignUp }) {
  const imageUrl = `${AVATAR_PATH}${activity.avatar}`;
  console.log("最終圖片 URL:", imageUrl);
  const [isLiked, setIsLiked] = useState(false);
  const { auth } = useAuth();

  return (
    <div className={Styles.card}>
  <div className={Styles.list}>
    <div className={Styles.img}>
      <img
        src={activity.avatar ? `${AVATAR_PATH}${activity.avatar}` : `${AVATAR_PATH}TeamB-logo-greenYellow.png`}
        alt=""
        className={Styles.avatarImage}
      />
    </div>
    <div className={Styles.information}>
      <div className={Styles.title}>
        <span className={Styles.titleIcons}>
          {activity.sport_name === "籃球" && <span className="icon-Basketball" />}
          {activity.sport_name === "排球" && <span className="icon-Volleyball" />}
          {activity.sport_name === "羽球" && <span className="icon-Badminton" />}
        </span>
        <h2 className={Styles.titleText}>{activity.activity_name}</h2>
      </div>
      
      <div className={Styles.info}>

      <div className={Styles.infoContent}>
      <p><span className={Styles.infoTitle}>地  點：</span>{activity.court_name}</p>
        <p><span className={Styles.infoTitle}>活動時間：</span>{activity.activity_time}</p>
        <p><span className={Styles.infoTitle}>費  用：</span>每人 {activity.payment} 元</p>
      </div>
      </div>
      <div className={Styles.buttonWrapper}>
        <a href={`/activity-list/${activity.al_id}`}>
          <button type="button" className={Styles.joinButton}>查看詳情</button>
        </a>
      </div>
    </div>
  </div>
</div>

  );
}
