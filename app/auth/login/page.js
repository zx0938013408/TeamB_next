"use client";
import React, { useState } from "react";
import styles from "../../../styles/auth/login.module.css";
import { useAuth } from "../../../context/auth-context";
import { useRouter } from "next/navigation";
import "font-awesome/css/font-awesome.min.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import {MB_GOOGLE_POST} from "../../../config/auth.api"

const Login = () => {
  
  const { login, setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ 關鍵：禁止 Google 自動登入造成 token 錯誤
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
  }, []);

  const lastVisitedPage = localStorage.getItem("lastVisitedPage") || "/auth/member";

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("請輸入電子郵件");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("請輸入正確格式的電子郵件");
      return;
    }
    if (!password) {
      setPasswordError("請輸入密碼");
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast.success("登入成功！", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setTimeout(() => {
        router.push(lastVisitedPage !== "/auth/login" ? lastVisitedPage : "/auth/member");
      }, 500);
    } else {
      setEmailError("帳號錯誤");
      setPasswordError("密碼錯誤");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <h1>TeamB</h1>
      </div>

      <div className={styles.rightSection}>
        <form onSubmit={handleLogin}>
          <h2>登入</h2>
          <div className={styles.inputBox}>
            <label htmlFor="email">電子郵件</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="請輸入電子郵件"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className={styles.error}>{emailError}</p>}
          </div>

          <div className={styles.inputBox}>
            <label htmlFor="password">密碼</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="請輸入密碼"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.eyeIcon}
              >
                <i className={`fa-regular ${showPassword ? "fa-eye" : "fa-eye-slash"}`} />
              </button>
            </div>
            {passwordError && <p className={styles.error}>{passwordError}</p>}
          </div>

          <div className={styles.submitSection}>
            <button type="submit" className={styles.loginBtn}>
              登入
            </button>
          </div>

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

        {/* ✅ Google 一鍵登入 */}
        <GoogleOAuthProvider clientId="881251310998-lj4kfi1a8c087ul4vmoisp815jq1hqbd.apps.googleusercontent.com">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const res = await fetch(MB_GOOGLE_POST, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential: credentialResponse.credential }),
              });

              const result = await res.json();

              if (result.success) {
                const authData = {
  id: result.data.id,
  email: result.data.email,
  name: result.data.name,
  avatar: result.data.avatar,
  birthday_date: result.data.birthday_date,
  gender: result.data.gender, // ✅ 新增
  phone: result.data.phone,
  address: result.data.address,
  city_id: result.data.city_id, // ✅ 新增
  area_id: result.data.area_id, // ✅ 新增
  sport: result.data.sport,
  sportText: result.data.sportText,
  token: result.data.token,
};
setAuth(authData);
localStorage.setItem("TEAM_B-auth", JSON.stringify(authData));


                setAuth(authData); // ✅ 更新 context
                localStorage.setItem("TEAM_B-auth", JSON.stringify(authData));

                toast.success("Google 登入成功", {
                  position: "top-center",
                  autoClose: 2000,
                  hideProgressBar: true,
                });

                if (result.data.isNew) {
                  router.push("/auth/google-member");
                } else {
                  router.push("/auth/member");
                }
              } else {
                toast.error("Google 登入失敗");
              }
            }}
            onError={() => {
              toast.error("Google 登入錯誤");
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
};

export default Login;
