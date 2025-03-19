import React from 'react'
import AuthLayout from '../components/AuthLayout'
import styles from "../../../styles/reset-password.module.css"

const ResetPassword = () => {
  return (
    <AuthLayout title="重置密碼" description="請輸入新密碼以繼續。">
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

    </AuthLayout>
  )
}

export default ResetPassword
