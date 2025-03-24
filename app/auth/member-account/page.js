"use client"
// import  "../../styles/globals.css"
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/auth/member-account.module.css";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import { useAuth } from "../../../context/auth-context"; 
import axios from "axios"; 
import { useRouter } from "next/navigation"; // 引入 useRouter
import {MB_PASSWORD_POST,MB_OLD_PASSWORD_POST} from "../../../config/auth.api"



const MemberAccount =()=>{

  const { auth, getAuthHeader } = useAuth(); // 從 AuthContext 中獲取 auth 和 getAuthHeader 函數
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // 用於導航
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
 

    if(!oldPassword ||!newPassword ||!confirmPassword){
      setError('每個欄位都是必填');
      return;
    }

    // 驗證新密碼和確認密碼是否一致
    if (newPassword !== confirmPassword) {
      setError('新密碼和確認密碼不一致');
      return;
    }

    // 檢查新密碼長度
    if (newPassword.length < 6) {
      setError('新密碼至少需要 6 個字符');
      return;
    }

    try {
      // 先驗證舊密碼是否正確
      const headers = getAuthHeader(); // 使用 getAuthHeader 獲取 token
      const passwordCheckResponse = await axios.post(
        MB_OLD_PASSWORD_POST, // 確保你的後端有這個 API 來檢查舊密碼
        { oldPassword },
        { headers }
      );
      
      console.log("Password Check Response:", passwordCheckResponse.data); // 確認後端是否正確回傳
    
      if (!passwordCheckResponse.data.success) {
        setError('舊密碼不正確');
        return; // 結束，避免繼續處理
      }
    
      // 如果舊密碼正確，則繼續更改密碼
      const response = await axios.post(
        MB_PASSWORD_POST,
        { oldPassword, newPassword, confirmPassword },
        { headers }
      );
    
      alert(response.data.message); // 顯示後端傳來的成功訊息
      router.push("/auth/login");
      
    } catch (error) {
      console.error("更改密碼時出錯:", error);
    
      // 嘗試讀取後端錯誤訊息
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("伺服器錯誤，請稍後再試");
      }
    }
    
  };

     return (
      <>
        <Header/>
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
    <p className={styles.prp}>原始密碼</p>
      <input
        className={styles.inputBox}
        type="password"
        value={oldPassword}
         onChange={(e) => setOldPassword(e.target.value)}
        placeholder="請輸入原始密碼"
        required=""
      />
    <p className={styles.prp}>新密碼</p>

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

<div className={styles.errorArea}>
{error && <p style={{ color: 'red' }}>{error}</p>}
</div>

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