"use client"
import React, { useState } from 'react'
import styles from "../../../styles/auth/forgot-password.module.css"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import {MB_VERIFY_POST} from "../../../config/auth.api"

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [school, setSchool] = useState("");
  const [idCard, setIdCard] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // 清空之前的錯誤

   
    if (!email || !school || !idCard) {
      setErrorMsg("所有欄位都是必填");
      return;
    }

    if (!/^[0-9]{4}$/.test(idCard)) {
      setErrorMsg("身分證後四碼格式不正確，請輸入4位數字");
      return;
    }

    try {
      const res = await axios.post(MB_VERIFY_POST, {
        email,
        school,
        id_card: idCard,
      });
  
      const { token } = res.data;
      router.push(`/auth/reset-password?token=${token}`);
    } catch (error) {
      // 顯示後端傳回的錯誤訊息
      setErrorMsg(error.response?.data?.message || "驗證失敗，請稍後再試");
    }
  };

  return (
    <div className={styles.container}>
      {/* 左側區塊 (綠色區塊) */}
      <div className={styles.leftSection}>
        <h1>重置密碼</h1>
        <div className={styles.separator}></div>
        <p>請輸入註冊時的會員資訊驗證，以便更新密碼。</p>
      </div>
      
      <div className={styles.rightSection}>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email" className={styles.label}>Email：</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            placeholder="請輸入 email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* 國小學校 */}
          <label htmlFor="school" className={styles.label}>國小的學校：</label>
          <input
            type="text"
            id="school"
            name="school"
            className={styles.input}
            placeholder="請輸入國小就讀學校"
            required
            value={school}
            onChange={(e) => setSchool(e.target.value)}
          />

          {/* 身分證後四碼 */}
          <label htmlFor="idCard" className={styles.label}>身分證後四碼：</label>
          <input
            type="text"
            id="idCard"
            name="idCard"
            className={styles.input}
            placeholder="請輸入身分證後四碼"
            required
            value={idCard}
            onChange={(e) => setIdCard(e.target.value)}
          />

          {/* 顯示錯誤訊息 */}
          {errorMsg && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errorMsg}
            </div>
          )}

          {/* 送出按鈕 */}
          <div className={styles.submitSection}>
            <button type="submit" className={styles.submitBtn}>
              送出
            </button>
          </div>
        </form>
      </div>
   </div>
  )
}

export default ForgotPassword
