"use client";
import styles from "../../../styles/auth/register.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {MB_EMAIL_POST} from "../../../config/auth.api"
import "font-awesome/css/font-awesome.min.css";


const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // 用來存 email 錯誤訊息
  const [passwordError, setPasswordError] = useState(""); // 用來存 password 錯誤訊息
  const [showPassword, setShowPassword] = useState(false); // 控制密碼顯示與隱藏


  // 驗證 email 格式
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  // 驗證密碼長度
  const validatePassword = (password) => {
    return password.length >= 6 ;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setEmailError(""); // 清空錯誤訊息
    setPasswordError(""); // 清空錯誤訊息

    // 驗證 email 和 password
    if (!email) {
      setEmailError("請填寫電子郵件");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("請輸入正確格式");
      return;
    }

    // 檢查 email 是否已經註冊
    const emailCheckRes = await fetch(`${MB_EMAIL_POST}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const emailCheckData = await emailCheckRes.json();

    if (!emailCheckData.success) {
      setEmailError("該用戶已註冊");
      return;
    }

    if (!password) {
      setPasswordError("請填寫密碼");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError("密碼必須至少 6 位數");
      return;
    }

    // ✅ 存入 localStorage
    localStorage.setItem("registerTemp", JSON.stringify({ email, password }));

    // ✅ 跳轉到第二頁
    router.push(`/auth/register-info`);
  };

  return (
    <div className={styles.container}>
    {/* 左側區塊 (綠色區塊) */}
    <div className={styles.leftSection}>
      <h1>TeamB</h1>
      <div className={styles.separator}></div>
      <p>Team進球場，Ball出火花！！！</p>
    </div>
      <div className={styles.rightSection}>
        <h2>註冊</h2>
        <form onSubmit={handleNext}>
          <div className={styles.inputBox}>
            <label htmlFor="email">電子郵件</label>
            <input
              type="text"
              id="email"
              name="email"
              className={styles.input}
              placeholder="請輸入電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* 顯示 email 錯誤訊息 */}
            {emailError && <p className={styles.error}>{emailError}</p>}
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="password">密碼</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={styles.input}
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeIcon}
              >
                {showPassword ? (
                  <i class="fa-regular fa-eye"></i>
                ) : (
                  <i class="fa-regular fa-eye-slash"></i>  
                )}
              </button>
            </div>
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <div className={styles.submitSection}>
            <button type="submit" className={styles.registerBtn}>
              下一步
            </button>
          </div>
        </form>
      </div>
   </div>
  );
};

export default Register;
