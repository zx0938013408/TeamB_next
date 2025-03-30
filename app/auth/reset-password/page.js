"use client"
import React, { useState } from 'react'
import styles from "../../../styles/auth/reset-password.module.css"
import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import {MB_RESET_POST} from "../../../config/auth.api"
import Swal from "sweetalert2"; // 引入 sweetalert2



const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false) // 控制新密碼顯示/隱藏
  const [showConfirmPassword, setShowConfirmPassword] = useState(false) // 控制確認密碼顯示/隱藏

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!newPassword || !confirmPassword) {
      setErrorMsg("請填寫所有欄位")
      return
    }

    if (newPassword.length < 6) {
      setErrorMsg("新密碼至少需 6 字")
      return
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("兩次輸入密碼不一致")
      return
    }

    try {
      const res = await axios.post(MB_RESET_POST, {
        token,
        newPassword,
      })

      Swal.fire({
        icon: "success",
        title: "修改成功！",
        text: "密碼重設成功，將導回登入頁",
        confirmButtonText: "確定",
        confirmButtonColor: "#4CAF50", // 修改按鈕顏色
      });

      router.push("/auth/login");

    } catch (error) {
      // 註冊失敗顯示錯誤提示
      Swal.fire({
        icon: "error",
        title: "修改失敗",
        text: "請稍後再試",
        confirmButtonText: "確定",
      });
      console.error("註冊失敗，錯誤訊息:", error);
    }
  };

  return (
    <div className={styles.container}>
      {/* 左側區塊 */}
      <div className={styles.leftSection}>
        <h1>重置密碼</h1>
        <div className={styles.separator}></div>
        <p>請輸入新密碼。</p>
      </div>

      {/* 右側表單區 */}
      <div className={styles.rightSection}>
        <form id="reset-password-form" onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <label htmlFor="new-password">密碼</label>
            <div className={styles.passwordContainer}>
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                placeholder="新密碼"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className={styles.eyeIcon}
              >
                {showNewPassword ? (
                  <i className="fa-regular fa-eye"></i>
                ) : (
                  <i className="fa-regular fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="confirm-password">密碼</label>
            <div className={styles.passwordContainer}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="再次輸入新密碼"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeIcon}
              >
                {showConfirmPassword ? (
                  <i className="fa-regular fa-eye"></i>
                ) : (
                  <i className="fa-regular fa-eye-slash"></i>
                )}
              </button>
            </div>
          </div>

          {/* 錯誤或成功訊息 */}
          {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
          {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

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
