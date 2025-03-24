"use client"
// import  "../../styles/globals.css"
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/auth/member-account.module.css";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import { useAuth } from "../../../context/auth-context"; 

import axios from "axios"; 


const MemberAccount =()=>{

  const { auth } = useAuth(); // 假設用戶登錄後可以從 auth 中取得用戶信息
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 密碼檢查
    if (!newPassword || !confirmPassword || !oldPassword) {
      setError("所有欄位都是必填的");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("新密碼與確認密碼不一致");
      return;
    }

    try {
      // 向後端發送請求
      const response = await axios.put(
        `http://localhost:3001/auth/update/password/${auth.id}`, // 用戶 ID 應從 auth 中獲取
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // 傳遞 Token
          },
        }
      );

      if (response.data.success) {
        setMessage("密碼更新成功");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "更新密碼時發生錯誤");
      }
    } catch (error) {
      console.error("錯誤:", error);
      setError("無法更新密碼，請稍後再試");
    }
  };


     return (
      <>
        {/* <Header/> */}
      <div className={styles.container}>
      {/* 側邊欄 */}
      <div className={styles.sidebar}>
        <Link href="/auth/member" className={styles.menuItem}>
          會員中心
        </Link>
        <Link href="/auth/member-edit" className={styles.menuItem}>
          編輯個人檔案
        </Link>
        <Link href="/auth/member-account" className={styles.menuItem}>
          帳號管理
        </Link>
        <Link href="#" className={styles.menuItem}>
          我的訂單
        </Link>
        <Link href="#" className={styles.menuItem}>
          收藏商品
        </Link>
      </div>
    
      <div className={styles.mainContent}>
  <div className={styles.title}>帳號管理</div>
  <div className={styles.rightSection}>
    <form className={styles.form} method="POST"  onSubmit={handleSubmit}>
    {error && <p style={{ color: "red" }}>{error}</p>}
    {message && <p style={{ color: "green" }}>{message}</p>}
    <p>原始密碼</p>
      <input
        className={styles.inputBox}
        type="password"
        value={oldPassword}
         onChange={(e) => setOldPassword(e.target.value)}
        placeholder="請輸入原始密碼"
        required=""
      />
    <p>新密碼</p>

      <input
        className={styles.inputBox}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="請輸入新密碼"
        required=""
      />
        <input
        className={styles.inputBox}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="再次確認新密碼"
        required=""
      />
      
      <div className={styles.confirm}>
        <button type="submit" className={styles.confirmBtn}>
          確認
        </button>
      </div>
    </form>
  </div>
</div>


      </div>
      </>
    );
  };
  
  
      
  export default MemberAccount