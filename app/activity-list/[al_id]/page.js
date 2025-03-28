"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "@/public/TeamB_Icon/style.css";
import Styles from "./activity-list-detail.module.css";
import { AL_ITEM_GET } from "@/config/api-path";
import LikeHeart from "@/components/like-hearts";
import { ST } from "next/dist/shared/lib/utils";
import { AVATAR_PATH } from "@/config/api-path";
import { useAuth } from "@/context/auth-context";


export default function ActivityDetailPage() {
  const { al_id } = useParams();
  const [activity, setActivity] = useState(null);
  const [showLightbox, setShowLightbox] = useState(false);
  const { auth } = useAuth(); // 獲取會員認證資料
  // 點擊圖片放大
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageList, setImageList] = useState([]);
const [currentIndex, setCurrentIndex] = useState(0);



useEffect(() => {
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
      <LikeHeart checked={activity.is_favorite} activityId={activity.al_id} />
              </span>
            </button>
            <button
              className={`${Styles.registerBtn} col ${activity.registered_people >= activity.need_num || new Date(activity.deadline) < new Date() ? Styles.buttonDisabled : ''}`}
              disabled={activity.registered_people >= activity.need_num || new Date(activity.deadline) < new Date()}
              onClick={() => {
                // 檢查是否登入
                if (!auth?.id) {
                  alert("請先登入");
                  window.location.href = "/auth/login"; // 或用 router.push
                  return;
                }
              
                // 如果可以報名，則開啟 modal
                // if (
                //   activity.registered_people < activity.need_num &&
                //   new Date(activity.deadline) > new Date()
                // ) {
                //   onQuickSignUp(activity); // ⬅️ 呼叫開 modal 的函式（你已經有）
                // }
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

    </>
  );
  
}
