"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "../../../styles/auth/member-account.module.css";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import { useAuth } from "../../../context/auth-context";
import axios from "axios";
import { useRouter } from "next/navigation"; // 引入 useRouter
import {
  MB_PASSWORD_POST,
  MB_OLD_PASSWORD_POST,
} from "../../../config/auth.api";
import "font-awesome/css/font-awesome.min.css";
import Swal from "sweetalert2"; // 引入 SweetAlert2
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MemberAccount = () => {
  const { auth, logout, getAuthHeader } = useAuth(); // 從 AuthContext 中獲取 auth 和 getAuthHeader 函數
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false); // 控制原始密碼顯示/隱藏
  const [showNewPassword, setShowNewPassword] = useState(false); // 控制新密碼顯示/隱藏
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 控制確認密碼顯示/隱藏

  const router = useRouter(); // 用於導航

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("每個欄位都是必填");
      return;
    }
  
    // 驗證新密碼和確認密碼是否一致
    if (newPassword !== confirmPassword) {
      setError("新密碼和確認密碼不一致");
      return;
    }
  
    // 檢查新密碼長度
    if (newPassword.length < 6) {
      setError("新密碼至少需要 6 個字符");
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
        setError("舊密碼不正確");
        return; // 結束，避免繼續處理
      }
  
      // 如果舊密碼正確，則繼續更改密碼
      const response = await axios.post(
        MB_PASSWORD_POST,
        { oldPassword, newPassword, confirmPassword },
        { headers }
      );
  
      // 從後端獲取回應訊息
      const responseMessage = response.data.message || "密碼更改成功，請重新登入";
  
      // 顯示 SweetAlert2 成功提示框
      Swal.fire({
        icon: "success",
        title: "修改成功！",
        text: responseMessage,  // 顯示後端回傳的訊息
        confirmButtonText: "確定",
        confirmButtonColor: "#4CAF50", // 修改按鈕顏色
      });
  
      router.push("/auth/login");
  
    } catch (error) {
      console.error("更改密碼時出錯:", error);
  
      // 嘗試讀取後端錯誤訊息
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
        Swal.fire({
          icon: "error",
          title: "錯誤",
          text: error.response.data.message,
          confirmButtonText: "確定",
          confirmButtonColor: "#FF4136",  // 可以自訂錯誤的按鈕顏色
        });
      } else {
        setError("伺服器錯誤，請稍後再試");
        Swal.fire({
          icon: "error",
          title: "伺服器錯誤",
          text: "請稍後再試",
          confirmButtonText: "確定",
          confirmButtonColor: "#FF4136",  // 可以自訂錯誤的按鈕顏色
        });
      }
    }
  };
  
  
  

  return (
    <>
      <Header />
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
          <Link href="/auth/orderHistory" className={styles.menuItem}>
            我的訂單
          </Link>
          <Link href="/auth/member-likes" className={styles.menuItem}>
            收藏商品
          </Link>
          <Link href="/auth/member-coupon" className={styles.menuItem}>我的優惠券</Link>
          <button
    className={styles.menuItemBtn}
    onClick={() => {
      logout();
      toast("會員已登出", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      router.push("/"); // 登出後導回首頁或登入頁
    }}
  >
    登出
  </button>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.title}>帳號管理</div>
          <div className={styles.rightSection}>
            <form className={styles.form} method="POST" onSubmit={handleSubmit}>
              <p className={styles.prp}>原始密碼</p>
              <div className={styles.passwordContainer}>
                <input
                  className={styles.inputBox}
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="請輸入原始密碼"
                  required=""
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className={styles.eyeIcon}
                >
                  {showOldPassword ? (
                    <i className="fa-regular fa-eye"></i>
                  ) : (
                    <i className="fa-regular fa-eye-slash"></i>
                  )}
                </button>
              </div>

              <p className={styles.prp}>新密碼</p>
              <div className={styles.passwordContainer}>
                <input
                  className={styles.inputBox}
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="請輸入新密碼"
                  required=""
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
              <div className={styles.passwordContainer}>
                <input
                  className={styles.inputBox}
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次確認新密碼"
                  required=""
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

              <div className={styles.confirm}>
                <div className={styles.errorArea}>
                  {error && <p style={{ color: "red" }}>{error}</p>}
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

export default MemberAccount;