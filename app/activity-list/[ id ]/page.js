'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Styles from "./activity-list-detail.module.css";
import { useParams } from "next/navigation";
import { AL_ITEM_GET } from "@/config/api-path";

export default function ActivityDetail() {
  const router = useRouter();
  const {al_id} = useParams();
  const [activity, setActivity] = useState(null);
  console.log("al_id", al_id);
  

  useEffect(() => {
    if (al_id) {
      fetch(`activity-list/api/${al_id}`)  // 確保這個 API 存在
        .then((res) => res.json())
        .then((data) => setActivity({data}))
        .catch((error) => console.error("Error fetching activity:", error));
    }
  }, [al_id]);

  if (!activity) return <p>加載中...</p>;

  return (
    <div className={Styles.container}>
      <nav className={Styles.breadcrumb}>
        <a href="/activity-list" className={Styles.notActiveText}>回上一頁</a>
      </nav>

      <div className={Styles.imgContainer}>
        {/* <div className={Styles.eventImages}>
          <img src={activity.imageUrl} alt="活動主圖" className={Styles.mainImage} />
        </div> */}

        <div className={Styles.eventInfo}>
          <h2 className={Styles.titleText}>{activity.activity_name}</h2>
          {/* <p><strong>地點：</strong>{activity.location}</p> */}
          <p><strong>活動時間：</strong>{activity.activity_time}</p>
          <p><strong>報名期限：</strong>{activity.deadline}</p>
          <p><strong>費用：</strong>每人 {activity.payment} 元</p>
          <p><strong>主辦：</strong>{activity.name}</p>
          {/* <p><strong>聯絡資訊：</strong>{activity.contact}</p> */}
        </div>
      </div>

      <div className={Styles.information}>
        <h2>活動詳情</h2>
        <p>{activity.description}</p>
      </div>

      <div className={Styles.eventActions}>
        <button className={Styles.collect}>收藏</button>
        <button className={Styles.registerBtn}>我要報名</button>
      </div>
    </div>
  );
}
