"use client";
// import "../../styles/globals.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/auth/member-edit.module.css";
import { useAuth } from "../../../context/auth-context"; // 引入 useAuth
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import {  useRouter } from "next/navigation";
import {MB_CITY_GET ,MB_AREA_GET,MB_EDIT_PUT} from "../../../config/auth.api";
// import {MB_AVATAR_POST} from "../../../config/auth.api"
import { AVATAR_PATH } from "@/config/auth.api";




const MemberEdit = () => {
  
  const { auth , updateUserData} = useAuth(); // 從上下文獲取 auth 資料
  console.log("auth:",auth);
  
  const [cities, setCities] = useState([]); 
  const [areas, setAreas] = useState([]); 
  const [name, setName] = useState( auth.name || "");
  const [gender, setGender] = useState(auth.gender || "");
  const [phone, setPhone] = useState(auth.phone || "");
  const [address, setAddress] = useState(auth.address || "");
  const [cityId, setCityId] = useState(auth.city_id || "");
  const [areaId, setAreaId] = useState(auth.area_id || "");
  const [avatar, setAvatar] = useState(auth.avatar || "");
  const [sport, setSport] = useState(auth.sport ||", " )
  const router = useRouter(); // 用於導航
  const [preview, setPreview] = useState(""); // 🔹 存圖片預覽 URL

  useEffect(() => {
  
    if (auth.id) {
      console.log("獲取到的用戶資料:", auth);
    (auth); 
    }
  }, [auth]);


  


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(MB_CITY_GET);
        const data = await response.json();
        if (data.success) {
          setCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);


  const handleCityChange = async (cityId) => {
    setCityId(cityId);
    try {
      const response = await fetch(`${MB_AREA_GET}/${cityId}`);
      const data = await response.json();
      if (data.success) {
        setAreas(data.data);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };




  const handleSportChange = (sportId) => {
    setSport((prev) => {
      // 確保 prev 是字串
      const currentSports = prev || "";
  
      // 檢查該運動是否已經選擇
      if (currentSports.includes(sportId)) {
        // 如果已經選擇過，移除該運動
        return currentSports.split(",").filter((id) => id !== sportId).join(",");
      } else {
        // 否則，新增該運動
        return currentSports ? `${currentSports},${sportId}` : sportId;
      }
    });
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 顯示圖片預覽
      setPreview(URL.createObjectURL(file)); // 為選中的檔案創建預覽 URL
    
      // 更新 avatar 狀態
      setAvatar(file); // 直接設置為選中的檔案
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await updateUserData({
      ...auth,
      name,
      gender,
      phone,
      address,
      city_id: cityId,
      area_id: areaId,
      avatar: avatar, 
      sport,
    });
    if (result === true) {
      router.push("/auth/member"); // 更新成功後，重定向到會員頁面
    }
  };
  



  // 取得用戶資料
  const getUserData = async () => {
    try {
      console.log(auth.token); // 在發送請求前檢查 token
      const response = await fetch(MB_EDIT_PUT, {
        
        method: "GET",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        
      });
      
      const data = await response.json();

      console.log("new:",data)
      
      if (data.success) {
        let user = data.data[0];
        setAddress(user.address);
        handleCityChange(user.city_id);
        setAreaId(user.area_id);
        setName(user.name);
        setGender(user.gender);
        setPhone(user.phone) ;
        setAvatar(user.avatar);
        setSport(user.sport_id)

      } else {
        console.log("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // // 取得用戶資料時，可以在 component mount 時呼叫
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
              <img
  src={preview || `${AVATAR_PATH}/${auth?.avatar}`}
  alt="User Avatar"
  className={styles.avatar}

/>
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
                <option value="男">男</option>
                <option value="女">女</option>
                <option value="其他">其他</option>
              </select>

              {/* 喜愛運動選擇 */}
              <div className={styles.checkboxGroup} >
              <label>喜愛運動：</label>
              <label>
                    <input
                      type="checkbox"
                      value="1"
                      checked={sport.includes("1")}
                      onChange={(e) =>handleSportChange("1")} 
                    />
                籃球
              </label>
              <label>
                <input type="checkbox" value="2" checked={sport.includes("2")} 
                  onChange={(e) =>handleSportChange("2")} 
                  />
                排球
              </label>
              <label>
                <input type="checkbox" value="3" checked={sport.includes("3")} 
                    onChange={(e) =>handleSportChange("3")} 
                />
                羽球
              </label>
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
            
              <div>
        <select className={styles.cityBox} value={cityId}  onChange={(e) => handleCityChange(e.target.value)}>
          <option value="">選擇縣市</option>
          {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}</option>
          ))}
        
        </select>

        <select  className={styles.cityBox}  value={areaId} onChange={(e) => setAreaId(e.target.value)} >
        <option value="">選擇地區</option>
        
        {areas.map((area) => (
              <option key={area.area_id} value={area.area_id}>
                {area.name}
          </option>
        ))}
        </select>

        <input
           className={styles.addressBox}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="請輸入詳細地址"
        />
      </div>

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
