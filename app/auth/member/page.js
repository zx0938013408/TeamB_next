"use client";
import "../../../styles/globals.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/auth/member.module.css";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import moment from 'moment';
import "@/public/TeamB_Icon/style.css";
import { AVATAR_PATH } from "../../../config/auth.api";
import ActivityCard from "../../../components/activity-list-card/ActivityCard";  // 顯示活動的卡片
import { MEMBER_ACTIVITIES } from "@/config/api-path"; // 已報名的 API 路徑
import { MEMBER_CREATED_ACTIVITIES } from "@/config/api-path"; // 已開團的 API 路徑
import { MEMBER_FAVORITES } from "@/config/api-path"; // 已收藏的 API 路徑

const isExpired = (activityTime) => {
  // 判斷活動時間是否已過
  return moment(activityTime).isBefore(moment(), "day");  // 判斷是否早於今天
};

const Member = () => {
  const { auth } = useAuth(); // 獲取會員認證資料
  const [user, setUser] = useState(null); // 儲存用戶資料
  const [registeredActivities, setRegisteredActivities] = useState([]); // 儲存會員已報名的活動
  const [createdActivities, setCreatedActivities] = useState([]); // 儲存會員已開團的活動
  const [favoriteActivities, setFavoriteActivities] = useState([]); // 儲存會員已收藏的活動
  const [activeTab, setActiveTab] = useState("registered"); // 用來控制顯示的活動類型，默認顯示已報名活動

  useEffect(() => {
    if (auth.id) {
      setUser(auth); // 設置用戶資料
      fetchRegisteredActivities(auth.id); // 獲取已報名的活動
      fetchCreatedActivities(auth.id); // 獲取已開團的活動
      fetchFavoriteActivities(auth.id); // 獲取已收藏的活動
    }
  }, [auth]);

  const fetchRegisteredActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已報名的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {};  // 解析 JWT 資料
      const token = auth.token;  // 提取 token 部分

      const response = await fetch(MEMBER_ACTIVITIES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`,  // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      if (data.success && data.activities) {
        setRegisteredActivities(data.activities);  // 設置已報名的活動資料
      } else {
        setRegisteredActivities([]);  // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setRegisteredActivities([]);  // 發生錯誤時設置空陣列
    }
  };

  const fetchCreatedActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已開團的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {};  // 解析 JWT 資料
      const token = auth.token;  // 提取 token 部分

      const response = await fetch(MEMBER_CREATED_ACTIVITIES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`,  // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      if (data.success && data.activities) {
        setCreatedActivities(data.activities);  // 設置已開團的活動資料
      } else {
        setCreatedActivities([]);  // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取已開團活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setCreatedActivities([]);  // 發生錯誤時設置空陣列
    }
  };

  const fetchFavoriteActivities = async (memberId) => {
    // 與後端 API 通訊，獲取已收藏的活動
    try {
      const storedAuth = localStorage.getItem("TEAM_B-auth");
      const auth = storedAuth ? JSON.parse(storedAuth) : {};  // 解析 JWT 資料
      const token = auth.token;  // 提取 token 部分

      const response = await fetch(MEMBER_FAVORITES(memberId), {
        headers: {
          Authorization: `Bearer ${token}`,  // 使用 Bearer token 格式
        },
      });

      const data = await response.json();
      if (data.success && data.activities) {
        setFavoriteActivities(data.activities);  // 設置已收藏的活動資料
      } else {
        setFavoriteActivities([]);  // 如果沒有活動資料或 API 返回錯誤，設置空陣列
        console.warn("無法獲取已收藏的活動資料", data);
      }
    } catch (error) {
      console.error("錯誤:", error);
      setFavoriteActivities([]);  // 發生錯誤時設置空陣列
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
              <span
                className={`${styles.tabItem} ${activeTab === "registered" ? styles.active : ""}`}
                onClick={() => setActiveTab("registered")}
              >
                已報名
              </span>
              <span
                className={`${styles.tabItem} ${activeTab === "created" ? styles.active : ""}`}
                onClick={() => setActiveTab("created")}
              >
                已開團
              </span>
              <span
                className={`${styles.tabItem} ${activeTab === "favorite" ? styles.active : ""}`}
                onClick={() => setActiveTab("favorite")}
              >
                已收藏
              </span>
            </div>
          </div>
          <hr />

          {/* 根據選中的活動類型顯示不同的活動 */}
          <div className={styles.tabContent}>
            {activeTab === "registered" && (
              registeredActivities.length > 0 ? (
                registeredActivities.map((activity) => (
                  <ActivityCard key={activity.al_id} activity={activity} isExpired={isExpired(activity.activity_time)} />
                ))
              ) : (
                <p>目前沒有已報名的活動。</p>
              )
            )}

            {activeTab === "created" && (
              createdActivities.length > 0 ? (
                createdActivities.map((activity) => (
                  <ActivityCard key={activity.al_id} activity={activity} isExpired={isExpired(activity.activity_time)} />
                ))
              ) : (
                <p>目前沒有已開團的活動。</p>
              )
            )}

            {activeTab === "favorite" && (
              favoriteActivities.length > 0 ? (
                favoriteActivities.map((activity) => (
                  <ActivityCard key={activity.al_id} activity={activity} isExpired={isExpired(activity.activity_time)} />
                ))
              ) : (
                <p>目前沒有已收藏的活動。</p>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Member;
