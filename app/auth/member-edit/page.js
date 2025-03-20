"use client";
// import "../../styles/globals.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/auth/member-edit.module.css";
import { useAuth } from "../../../context/auth-context"; // 引入 useAuth
import { useRouter } from "next/navigation"; // 引入 useRouter
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";

const MemberEdit = () => {
  const { auth, getAuthHeader } = useAuth(); // 從上下文獲取 auth 資料
  const router = useRouter(); // 用於導航

  const [name, setName] = useState(auth.name || ""); // 設定初始值
  const [gender, setGender] = useState(auth.gender || ""); 
  const [sports, setSports] = useState(auth.sport ? auth.sport.split("、") : []); // 解析喜愛運動
  const [phone, setPhone] = useState(auth.phone || ""); 
  const [address, setAddress] = useState(auth.address || ""); 
  const [avatar, setAvatar] = useState(`http://localhost:3001${auth.avatar}`  || ""); 

  // 提交修改資料
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = {
      name,
      gender,
      sport: sports.join("、"), // 喜愛運動用 "、" 分隔
      phone,
      address,
      avatar,
    };

    try {
      const response = await fetch("http://localhost:3001/user-idit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(), // 在標頭中傳遞 token
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();
      if (data.success) {
        // 更新成功，重新設定 user 資料
        router.push("/member"); // 重定向到會員中心
      } else {
        alert("更新失敗");
      }
    } catch (error) {
      console.error("更新失敗:", error);
    }
  };

  // 處理圖片預覽
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  // 取得用戶資料
  const getUserData = async () => {
    try {
      console.log(auth.token); // 在發送請求前檢查 token
      const response = await fetch("http://localhost:3001/user-profile", {
        
        method: "GET",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        console.log("User data:", data.user);
      } else {
        console.log("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 取得用戶資料時，可以在 component mount 時呼叫
  useEffect(() => {
    getUserData(); // 在組件載入時呼叫
  }, []);

  return (
    <>
    <Header/>
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
        <Link href="#" className={styles.menuItem}>
          我的訂單
        </Link>
        <Link href="#" className={styles.menuItem}>
          收藏商品
        </Link>
      </div>
      
      {/* 主內容 */}
      <div className={styles.mainContent}>
        <div className={styles.title}>編輯個人檔案</div>
        <div className={styles.rightSection}>
          <form id={styles.profileForm}  onSubmit={handleSubmit} encType="multipart/form-data" >
            {/* 頭像上傳 */}
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <img id="avatar-preview"  src={avatar}  alt="Avatar" />
              </div>
  
              <label htmlFor="avatar-upload" className={styles.uploadLabel}>
                更換頭像
              </label>
              <input
                type="file"
                id="avatar-upload"  
                name="avatar"
                accept="image/*"
                style={{ display: "none" }} 
                onChange={handleAvatarChange}
              />
            </div>

            {/* 姓名輸入框 */}
            <div className={styles.form}>
              <input
                className={styles.inputBox}
                type="text"
                id="name"
                name="name"
                placeholder="姓名"
                value={name}
                onChange={(e) => setName(e.target.value)} // 更新姓名
              />

              {/* 性別選擇 */}
              <select 
                className={styles.selectBox} 
                id="gender" 
                name="gender"
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)} // 更新性別
              >
                <option value="" disabled hidden>性別</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>

              {/* 喜愛運動選擇 */}
              <div className={styles.checkboxGroup}>
                <label>喜愛運動：</label>
                {["籃球", "排球", "羽球"].map((sport) => (
                  <div className={styles.checkboxItem} key={sport}>
                    <input
                      type="checkbox"
                      id={sport}
                      name="sports"
                      value={sport}
                      checked={sports.includes(sport)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSports([...sports, sport]);
                        } else {
                          setSports(sports.filter((item) => item !== sport));
                        }
                      }}
                    />
                    <label htmlFor={sport}>{sport}</label>
                  </div>
                ))}
              </div>

              {/* 其他輸入框 */}
              <input
                className={styles.inputBox}
                type="text"
                id="phone"
                name="phone"
                placeholder="手機"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} // 更新電話
              />
              <input
                className={styles.inputBox}
                type="text"
                id="address"
                name="address"
                placeholder="地址"
                value={address}
                onChange={(e) => setAddress(e.target.value)} // 更新地址
              />

              {/* 送出按鈕 */}
              <div className={styles.confirm}>
                <button type="submit" className={styles.confirmBtn}>
                  確認
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    </>
  );
};

export default MemberEdit;
