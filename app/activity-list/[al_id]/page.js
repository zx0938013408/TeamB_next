"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/public/TeamB_Icon/style.css";
import Styles from "./activity-list-detail.module.css";
import { AL_ITEM_GET } from "@/config/api-path";
import LikeHeart from "@/components/like-hearts";
import { ST } from "next/dist/shared/lib/utils";
import { AVATAR_PATH } from "@/config/api-path";

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
          <div className={Styles.mainImage}></div>
          {activity.avatar ? (
            <img src={`${AVATAR_PATH}${activity.avatar}`} alt="" height="100" />
          ) : (
            <img
              src={`${AVATAR_PATH}/TeamB-logo-greenYellow.png`}
              alt=""
              height="100"
            />
          )}
          <div className={Styles.thumbnailContainer}>
            <div className={Styles.thumbnail}>
              {activity.avatar ? (
                <img
                  src={`${AVATAR_PATH}${activity.avatar2}`}
                  alt=""
                  height="100"
                />
              ) : (
                <img
                  src={`${AVATAR_PATH}/TeamB-logo-greenYellow.png`}
                  alt=""
                  height="100"
                />
              )}
            </div>
            <div className={Styles.thumbnail}>
              {activity.avatar ? (
                <img
                  src={`${AVATAR_PATH}${activity.avatar3}`}
                  alt=""
                  height="100"
                />
              ) : (
                <img
                  src={`${AVATAR_PATH}/TeamB-logo-greenYellow.png`}
                  alt=""
                  height="100"
                />
              )}
            </div>
            <div className={Styles.thumbnail}>
              {activity.avatar ? (
                <img
                  src={`${AVATAR_PATH}${activity.avatar4}`}
                  alt=""
                  height="100"
                />
              ) : (
                <img
                  src={`${AVATAR_PATH}/TeamB-logo-greenYellow.png`}
                  alt=""
                  height="100"
                />
              )}
            </div>
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

          {/* 報名情況 */}
          <div className={`${Styles.registerInfo} row`}>
            <h3 className="col">報名情況：</h3>
            <button
              type="button"
              className={`${Styles.registerInfoBtn} col`}
              //onClick={toggleRegisterStatus}
            >
              額滿 : {activity.registered_people}/{activity.need_num} 人
            </button>
          </div>

          {/* 人數選擇 */}
          <div className={Styles.selectGroup}>
            <label htmlFor="people">人數</label>
            <select id="people" name="people">
              <option value="1">1 人</option>
              <option value="2">2 人</option>
              <option value="3">3 人</option>
              <option value="4">4 人</option>
            </select>
          </div>

          {/* 收藏與報名按鈕 */}
          <div className={`${Styles.eventActions} row`}>
            <button
              type="button"
              className={`${Styles.collect} col-2`}
              //onClick={toggleHeartStatus}
            >
              <span className={Styles.likeHeart}>
                <LikeHeart />
              </span>
            </button>
            <button className={`${Styles.registerBtn} col`}>我要報名</button>
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
    </>
  );
}
