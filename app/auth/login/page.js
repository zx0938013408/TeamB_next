"use client";
import React, { useState } from "react";
import styles from "../../../styles/auth/login.module.css";
import { useAuth } from "../../../context/auth-context"; // 引入 useAuth
import { useRouter } from "next/navigation"; // 引入 useRouter

const Login = () => {

    const { login } = useAuth(); // 從上下文中取得 login 函數
    const [email, setEmail] = useState(""); // 記錄輸入的電子郵件
    const [password, setPassword] = useState(""); // 記錄輸入的密碼
    const [error, setError] = useState(""); // 記錄錯誤訊息
    const [emailError, setEmailError] = useState(""); // 記錄 email 欄位錯誤
    const [passwordError, setPasswordError] = useState(""); // 記錄 password 欄位錯誤
    const router = useRouter(); // 用於導航

    const validateEmail = (email) => {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailPattern.test(email);
    };
  
    const handleLogin = async (e) => {
      e.preventDefault();
  
      // 清除先前的錯誤訊息
      setEmailError(""); 
      setPasswordError(""); 
  
      // 驗證電子郵件
      if (!email) {
        setEmailError("請輸入電子郵件");
        return;
      }
      
      if (!validateEmail(email)) {
        setEmailError("請輸入正確格式的電子郵件");
        return;
      }
  
      // 驗證密碼
      if (!password) {
        setPasswordError("請輸入密碼");
        return;
      }
  
      const success = await login(email, password); // 調用 login 函數
  
      if (success) {
        // 顯示登入成功的提示
        alert("登入成功！");
  
        // 導向會員頁面
        router.push("/auth/member");
      } else {
        // 如果登入失敗，顯示帳號或密碼錯誤的訊息
        setEmailError("帳號錯誤");  // 這裡會顯示 email 錯誤訊息
        setPasswordError("密碼錯誤"); // 密碼錯誤訊息
      }
  };
  
  return (
    <div className={styles.container}>
    {/* 左側區塊 (綠色區塊) */}
    <div className={styles.leftSection}>
      <h1>TeamB</h1>
    </div>
      <div className={styles.rightSection}>
      <form onSubmit={handleLogin}>
          <h2>登入</h2>
          {/* 電子郵件輸入框 */}
          <div className={styles.inputBox}>
            <label htmlFor="email">電子郵件</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="請輸入電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 更新 email 狀態
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
            <p className={styles.error}></p>
          </div>

          {/* 密碼輸入框 */}
          <div className={styles.inputBox}>
            <label htmlFor="password">密碼</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="請輸入密碼"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // 更新 password 狀態

            />
            {passwordError && <p className={styles.error}>{passwordError}</p>} 
          </div>

          {/* 送出按鈕 */}
          <div className={styles.submitSection}>
            <button type="submit" className={styles.loginBtn}>
              登入
            </button>
          </div>

          {/* 連結 */}
          <div className={styles.links}>
            <a href="/auth/forgot-password" className="forgot-link">
              忘記密碼
            </a>
            <span>尚未註冊？</span>
            <a href="/auth/register" className="register-link">
              前往註冊會員
            </a>
          </div>
        </form>
      </div>
      </div>
  );
};

export default Login;
