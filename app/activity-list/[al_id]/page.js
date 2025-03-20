"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/public/TeamB_Icon/style.css";
import Styles from "./activity-list-detail.module.css";
import { AL_ITEM_GET } from "@/config/api-path";
import Image from "next/image";

export default function ActivityDetailPage() {
  const { al_id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (!al_id) return;

    const apiUrl = `${AL_ITEM_GET}/${al_id}`;
    console.log(`📢 正在請求 API: ${apiUrl}`); // 確保 fetch() 請求的 URL 是正確的

    fetch(apiUrl)
      .then(async (res) => {
        console.log(`✅ API 響應狀態: ${res.status}`);

        // 嘗試讀取回應內容
        const responseText = await res.text();
        console.log("📄 API 回應內容:", responseText); // 這裡會顯示 JSON 或錯誤 HTML

        try {
          return JSON.parse(responseText);
        } catch (error) {
          throw new Error("❌ API 回應的不是 JSON，可能是錯誤頁面");
        }
      })
      .then((data) => {
        console.log("📦 API 回傳資料:", data);
        if (data.success) {
          setActivity(data.data);
        } else {
          console.error("❌ API 內部錯誤:", data.error);
        }
      })
      .catch((error) => console.error("❌ fetch 錯誤:", error));
  }, [al_id]);

  if (!activity) {
    return <p className={Styles.loading}>載入中...</p>;
  }

  return (
    <>
      {/* 麵包屑 */}
      <div className={`${Styles.container} mx-auto bread`}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="notActive">
              <a href="./activity-list.html" className="notActiveText">
                回上一頁
              </a>
            </li>
          </ol>
        </nav>
      </div>
      {/* 活動圖片與資訊 */}
      <div className={`${Styles.container} mx-auto ${Styles.imgContainer}`}>
        <div className={Styles.eventImages}>
          {/* <Image src="../public/photo/activity-shuttlecockCourt.jpg" alt="活動主圖" className={Styles.mainImage} />
          <div className={Styles.thumbnailContainer}>
            <Image src="../public/photo/activity-shuttlecockCourt.jpg" alt="縮圖1" className={Styles.thumbnail} />
            <Image src="../public/photo/activity-shuttlecockCourt.jpg" alt="縮圖2" className={Styles.thumbnail} />
            <Image src="../public/photo/activity-shuttlecockCourt.jpg" alt="縮圖3" className={Styles.thumbnail} /> */}
        </div>
      </div>

      {/* 活動資訊區 */}
      <div className={Styles.eventInfo}>
        <div>
          <div className={`${Styles.title} row`}>
            <div className={`${Styles.titleIcons} col-1`}>
            {activity.sport_name === "籃球" ? (
                <span className={`icon-Basketball ${Styles.titleIcon} col`}></span>
              ) : activity.sport_name === "排球" ? (
                <span className={`icon-Volleyball ${Styles.titleIcon} col`}></span>
              )  : activity.sport_name === "羽球" ? (
                <span className={`icon-Badminton ${Styles.titleIcon} col`}></span>
              ) 
              : null}
            </div>
            <h2 className={`${Styles.titleText} col`}>
              {activity.activity_name}
            </h2>
          </div>
          <div className={Styles.info}></div>
        </div>

        <p>
          <strong>地&emsp;&emsp;點：</strong>
          {activity.court_name}{" "}
          <a href="https://www.google.com/maps?authuser=0" target="_blank">
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
      </div>
    </>
  );
}
