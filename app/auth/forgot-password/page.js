"use client"
import React, { useState } from 'react'
import styles from "../../../styles/auth/forgot-password.module.css"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")

  // 處理表單提交
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("提交的電子郵件:", email)
    // 在這裡發送 API 請求
  }

  return (
    <div className={styles.container}>
    {/* 左側區塊 (綠色區塊) */}
    <div className={styles.leftSection}>
      <h1>重置密碼</h1>
      <div className={styles.separator}></div>
      <p>請輸入電子郵件。</p>
    </div>
      <div className={styles.rightSection}>
        <form onSubmit={handleSubmit}>
          {/* 電子郵件 */}
          <label htmlFor="email" className={styles.label}>電子郵件</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            placeholder="請輸入電子郵件"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
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
