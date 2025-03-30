"use client";
import { useState, useEffect } from "react";
import styles from "../styles/auth/NotificatioonBell.module.css";
import { useAuth } from "../context/auth-context";

function NotificationBell({ token }) {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(true); // 控制通知顯示狀態
  const { auth } = useAuth(); // 假設 useAuth hook 也提供了用戶資料

  // 監聽 token 改變，並根據登入狀態抓取通知
  useEffect(() => {
    if (!token) {
      console.log("No token provided");
      return;
    }

    // 根據 token 來抓取通知
    fetch(`http://localhost:3001/auth/notifications/${auth.id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // 正確傳遞 JWT Token
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNotifications(data.notifications);
        } else {
          console.log(data.message); // 處理錯誤訊息
        }
      })
      .catch((err) => console.error("Error fetching notifications:", err));

    // 檢查 localStorage 中的狀態，重新登入後恢復通知的顯示
    const notificationVisibility = localStorage.getItem("notificationVisibility");
    if (notificationVisibility === "hidden") {
      setIsNotificationVisible(false);
    } else {
      setIsNotificationVisible(true); // 重新登入後顯示通知
    }
  }, [token, auth.id]);

  // 點擊通知鈴鐺時，顯示或隱藏通知數量
  const handleNotificationClick = () => {
    setIsOpen(!isOpen);

    // 點擊後的通知隱藏狀態保存到 localStorage
    if (isNotificationVisible) {
      localStorage.setItem("notificationVisibility", "hidden");
      setIsNotificationVisible(false);
    }
  };

  return (
    <div className={styles.notificationBell}>
      <button onClick={handleNotificationClick}>
        🔔 
        {isNotificationVisible && notifications.length > 0 && (
          <span className={styles.notificationCount}>{notifications.length}</span>
        )}
      </button>

      {/* 下拉式選單 */}
      <div className={`${styles.notificationDropdown} ${isOpen ? styles.open : ""}`}>
        {notifications.length === 0 ? (
          <p>目前沒有新通知</p>
        ) : (
          <>
            <div className={styles.notificationSectionTitle}>通知</div>
            <div className={styles.notificationSeparator}></div> {/* 下劃線 */}
            {notifications.map((n) => (
              <div key={n.al_id} className={styles.notificationItem}>
                <a href={`/activity-list/${n.al_id}`} className={styles.notificationLink}>
                  <div className={styles.notificationContent}>
                    <div className={styles.notificationTitle}>
                      {n.activity_name}
                    </div>
                    <div className={styles.notificationTime}>
                      {new Date(n.activity_time).toLocaleString()}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default NotificationBell;
