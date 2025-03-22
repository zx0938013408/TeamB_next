import React from 'react'
import styles from "../../../styles/auth/reset-password.module.css"

const ResetPassword = () => {
  return (
    <div className={styles.container}>
    {/* 左側區塊 (綠色區塊) */}
    <div className={styles.leftSection}>
      <h1>重置密碼</h1>
      <div className={styles.separator}></div>
      <p>請輸入傳送的新密碼。。</p>
    </div>
    <div className={styles.rightSection}>
  <form id="reset-password-form">
    <div className={styles.inputBox}>
      <label htmlFor="password">密碼</label>
      <input
        type="password"
        id="new-password"
        placeholder="新密碼"
        required=""
      />
    </div>
    <div className={styles.inputBox}>
      <label htmlFor="password">密碼</label>
      <input
        type="password"
        id="confirm-password"
        placeholder="再次輸入新密碼"
        required=""
      />
    </div>
    <div className={styles.resetActions}>
      <button type="submit" className={styles.submitButton}>
        送出
      </button>
    </div>
  </form>
</div>

    </div>
  )
}

export default ResetPassword
