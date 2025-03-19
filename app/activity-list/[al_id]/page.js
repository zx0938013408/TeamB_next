"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Styles from "./activity-list-detail.module.css";
import { AL_ITEM_GET } from "@/config/api-path";

export default function ActivityDetailPage() {
  const { al_id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!al_id) return;

    fetch(`${AL_ITEM_GET}/${al_id}`)
  .then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return res.json();
  })
  .then((data) => {
    console.log("API 回傳資料:", data); // 確保 API 正確回傳 JSON
    if (data.success) {
      setActivity(data.data);
    } else {
      console.error("API 回傳錯誤:", data.error);
    }
  })
  .catch((error) => console.error("Error fetching activity details:", error))});


  if (!activity) {
    return <p className={Styles.loading}>載入中...</p>;
  }

  return (
    <div className={Styles.container}>
      <nav className={Styles.breadcrumb}>
        <a href="/activity-list" className={Styles.notActiveText}>
          回上一頁
        </a>
      </nav>
      <div className={Styles.imgContainer}>
        <img src="/public/photo/activity-shuttlecockCourt.jpg" alt="活動主圖" className={Styles.mainImage} />
      </div>
      <div className={Styles.eventInfo}>
        <h2 className={Styles.title}>{activity.activity_name}</h2>
        <p><strong>地點：</strong> {activity.location}</p>
        <p><strong>活動時間：</strong> {activity.activity_time}</p>
        <p><strong>報名期限：</strong> {activity.deadline}</p>
        <p><strong>費用：</strong> {activity.payment} 元</p>
        <p><strong>主辦：</strong> {activity.name}</p>
        <button className={Styles.registerBtn}>我要報名</button>
      </div>
    </div>
  );
}
