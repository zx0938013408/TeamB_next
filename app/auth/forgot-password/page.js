"use client"
import React, { useState } from 'react'
import AuthLayout from '../components/AuthLayout'
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
    
    <AuthLayout
      title="重置密碼"
      description="請輸入帳號使用的電子郵件地址以繼續。"
    >
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
    </AuthLayout>
  )
}

export default ForgotPassword
