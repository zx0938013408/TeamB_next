"use client";
import "../../../styles/globals.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/auth/member.module.css";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import moment from 'moment';
import "@/public/TeamB_Icon/style.css";
import {AVATAR_PATH} from "../../../config/auth.api"
import ActivityCard from "../../../components/activity-list-card/ActivityCard"; // 使用已報名活動卡片
import { MEMBER_ACTIVITIES } from "@/config/api-path";


const Member = () => {
  const { auth } = useAuth(); // 獲取會員認證資料
  const [user, setUser] = useState(null); // 儲存用戶資料
  const [activities, setActivities] = useState([]); // 儲存會員已報名的活動

  useEffect(() => {
    if (auth.id) {
      setUser(auth); // 設置用戶資料
      fetchRegisteredActivities(auth.id); // 獲取已報名的活動
    }
  }, [auth]);

  const fetchRegisteredActivities = async (memberId) => {
    try {
      console.log("發送請求，會員 ID:", memberId);  // 確認會員 ID 是否傳遞
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {};  // 解析 JWT 資料
      const token = auth.token;  // 提取 token 部分
      console.log("JWT 令牌:", token);  // 確認 JWT 是否正確獲取
    
      const response = await fetch(MEMBER_ACTIVITIES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`,  // 使用 Bearer token 格式
        },
      });
    
      console.log("API 請求結果:", response);  // 確認請求結果是否有回應
      const data = await response.json();
      if (data.success && data.activities) {  // 檢查 activities 屬性
        setActivities(data.activities);  // 正確設置 activities 資料
      } else {
        setActivities([]);  // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setActivities([]);  // 發生錯誤時設置空陣列
    }
  };
  
  
  

  if (!user) return <p>載入中...</p>;

  return (
    <>
         <Header />
    

    <div className={styles.container}>
      {/* 側邊欄 */}
      <div className={styles.sidebar}>
        <Link href="/auth/member" className={styles.menuItem}>會員中心</Link>
        <Link href="/auth/member-edit" className={styles.menuItem}>編輯個人檔案</Link>
        <Link href="/auth/member-account" className={styles.menuItem}>帳號管理</Link>
        <Link href="#" className={styles.menuItem}>我的訂單</Link>
        <Link href="#" className={styles.menuItem}>收藏商品</Link>
      </div>
 

      {/* 右側內容 */}
      <div className={styles.content}>
        <div className={styles.profileHeader}>
           {/* 會員的 Avatar */}
           <img
  src={user?.avatar ? `${AVATAR_PATH}/${user.avatar}` : `${AVATAR_PATH}/imgs.png`}
  alt="User Avatar"
  className={styles.avatar}

/>
          <div className={styles.userInfo}>
          <h2>{user?.name || "未命名使用者"}</h2>
          <p>生日：{user?.birthday_date ? moment(user.birthday_date).format('YYYY-MM-DD') : "未填寫"}</p>

            <p>喜愛運動：{user?.sports || "未填寫"}</p>
          </div>
        </div>

        {/* 分頁選單 */}
        <div className={styles.tabMenu}>
          <div className={styles.tabLeft}>
            <span className={`${styles.tabItem} ${styles.active}`}>
              已報名
            </span>
            <span className={`${styles.tabItem}`}>
              已開團
            </span>
            <span className={`${styles.tabItem}`}>
              活動歷史
            </span>
            <span className={`${styles.tabItem}`}>
              收藏的活動
            </span>
          </div>
        </div>

        <hr />

        {/* 顯示已報名的活動 */}
        <div className={styles.tabContent}>
  {activities && activities.length > 0 ? (
    activities.map((activity) => (
      <ActivityCard key={activity.al_id} activity={activity} />
    ))
  ) : (
    <p>目前沒有已報名的活動。</p>
  )}
</div>
      </div>
    </div>

    </>
  );
};

export default Member;

