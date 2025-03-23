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


const Member = () => {
  const { auth } = useAuth(); // 從上下文獲取 auth 資料
  const [user, setUser] = useState(null); // 記錄用戶資料



  useEffect(() => {

    if (auth.id) {
      console.log("獲取到的用戶資料:", auth);
      setUser(auth); // 如果用戶已登入，將 auth 資料設置到 user 狀態
    }
  }, [auth]);
  
  useEffect(() => {
    if (auth.id) {
      setUser(auth); // 如果用戶已登入，將 auth 資料設置到 user 狀態
    }
  }, [auth]);
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

        {/* 內容顯示區 */}
        <div className={styles.tabContent}>
          <p>這裡顯示已報名的活動內容。</p>
        </div>
      </div>
    </div>

    </>
  );
};

export default Member;

