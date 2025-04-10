import Link from "next/link";
import { useState, useEffect } from "react";
import Styles from "../../app/activity-list/activity-list.module.css";
import LikeHeart from "../like-hearts";
import { AVATAR_PATH, API_SERVER } from "@/config/api-path";
import { useAuth } from "@/context/auth-context";
import Swal from "sweetalert2"; // 引入 SweetAlert2


export default function ActivityCard({ activity, currentPage,  fromFavorite, onQuickSignUp, onLikeToggle, onRegistered, }) {
  // 取得當前日期
  const currentDate = new Date();
  const activityDate = new Date(activity.activity_time);
  const { auth } = useAuth(); // 獲取會員認證資料

  // 判斷活動是否過期
  const isExpired = activityDate < currentDate;
  const isFull = activity.registered_people >= activity.need_num;
  const isDeadlinePassed = new Date(activity.deadline) < new Date();
  const [isRegistered, setIsRegistered] = useState(false);
  

  useEffect(() => {
    
    const fetchRegistered = async () => {
      if (!auth?.id || !activity?.al_id) return;
      try {
        const res = await fetch(
          `${API_SERVER}/registered/check?activity_id=${activity.al_id}&member_id=${auth.id}`
        );
        const data = await res.json();
        console.log("✅ 報名查詢結果:", data); // 建議保留
  
        if (data.success && data.isRegistered) {
          setIsRegistered(true);
        }
      } catch (err) {
        console.error("❌ 無法確認是否已報名:", err);
      }
    };
  
    fetchRegistered();
  }, [activity?.al_id, auth?.id]);
  
  useEffect(() => {
    const savedPosition = sessionStorage.getItem("scrollPosition");
    if (savedPosition) {
      window.scrollTo({ top: parseInt(savedPosition, 10), behavior: "auto" });
      sessionStorage.removeItem("scrollPosition");
    }
  }, []);


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
              <a
                href={`https://www.google.com/maps/search/?api=1&query=台南市${activity.court_name}`}
                target="_blank"
              >
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
            href={`/activity-list/${activity.al_id}`}
            onClick={() => {
              sessionStorage.setItem("scrollPosition", window.scrollY.toString());
              // 如果有 currentPage（活動列表頁）就記錄
              if (typeof currentPage !== "undefined") {
                sessionStorage.setItem("currentPage", currentPage.toString());
                sessionStorage.setItem("fromPage", "/activity-list");
              }
          
              // 如果有 （收藏活動 會員頁）就記錄
              if (typeof fromFavorite !== "undefined" && fromFavorite === true) {
                sessionStorage.setItem("memberTab", "favorite");
                sessionStorage.setItem("fromPage", "/auth/member")
              }
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
              isExpired || isDeadlinePassed || isFull || isRegistered
                ? Styles.buttonDisabled
                : ""
            }`}
            disabled={isExpired || isDeadlinePassed || isFull || isRegistered}
            onClick={() => {
              if (isRegistered) return;
            
              if (!auth?.id) {
                Swal.fire({
                  icon: "warning",
                  text: "請先登入",
                  confirmButtonText: "確定",
                  confirmButtonColor: "#29755D",
                  timer: 1300,
                  showConfirmButton: false,
                  allowOutsideClick: false,
                  didClose: () => {
                    document.body.style.overflow = ''
                    window.location.href = "/auth/login";
                  },
                });
                return;
              }
            
              if (!isExpired && !isFull && typeof onQuickSignUp === "function") {
                onQuickSignUp(activity, () => setIsRegistered(true)); // ✅ 父層會開 Modal
                // setIsRegistered(true);   // ✅ 即時更新狀態
              }
            }}
          >
            {isRegistered
              ? "已報名"
              : isFull
              ? "已額滿"
              : isDeadlinePassed
              ? "報名截止"
              : "快速報名"}
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
