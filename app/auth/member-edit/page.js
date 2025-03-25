"use client";
// import "../../styles/globals.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/auth/member-edit.module.css";
import { useAuth } from "../../../context/auth-context"; // 引入 useAuth
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import { useParams, useRouter } from "next/navigation";
import {MB_CITY_GET ,MB_AREA_GET} from "../../../config/auth.api";
import {MB_AVATAR_POST} from "../../../config/auth.api"
import { AVATAR_PATH } from "@/config/auth.api";




const MemberEdit = () => {
  
  const { auth } = useAuth(); // 從上下文獲取 auth 資料
  console.log("auth:",auth);
  
  const [cities, setCities] = useState([]); 
  const [areas, setAreas] = useState([]); 
  const [name, setName] = useState(auth.name || "");
  const [gender, setGender] = useState(auth.gender || "");
  const [phone, setPhone] = useState(auth.phone || "");
  const [address, setAddress] = useState(auth.address || "");
  const [cityId, setCityId] = useState(auth.city_id || "");
  const [areaId, setAreaId] = useState(auth.area_id || "");
  const [avatar, setAvatar] = useState(auth.avatar || "");
  const [sport, setSport] = useState(auth.sport ||[] )
  const [selectedSports, setSelectedSports] = useState("");
  const router = useRouter(); // 用於導航
  const [preview, setPreview] = useState(""); // 🔹 存圖片預覽 URL
  const [user, setUser] = useState(null);

  useEffect(() => {
  
    if (auth.id) {
      console.log("獲取到的用戶資料:", auth);
      setUser(auth); // 如果用戶已登入，將 auth 資料設置到 user 狀態
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
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((id) => id !== sportId) : [...prev, sportId]
    );
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 創建 FormData 物件
    const formData = new FormData();
    formData.append("name", name);
    formData.append("gender", gender);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("city_id", cityId);
    formData.append("area_id", areaId);
    formData.append("sport", sport);
  
    // 如果有選擇頭像，添加到 FormData 中
    if (avatar) {
      formData.append("avatar", avatar);
    }
  
    try {
      const response = await fetch(`http://localhost:3001/auth/member/api/${auth.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
        body: formData,  // 這裡使用 FormData 而非 JSON
      });
  
      const data = await response.json();
      if (data.success) {
        alert("資料更新成功");
        
        // 更新 auth 上下文中的資料
        auth.name = name;
        auth.gender = gender;
        auth.phone = phone;
        auth.address = address;
        auth.city_id = cityId;
        auth.area_id = areaId;
        auth.avatar = data.data.avatar;  // 確保更新頭像
        auth.sport = sport;
        
        // 更新後顯示新的頭像
        router.push("/auth/member"); // 更新成功後，重定向到會員頁面
      } else {
        alert("更新失敗，請檢查資料");
      }
    } catch (error) {
      console.error("更新資料時發生錯誤:", error);
    }
  };
  



  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 顯示圖片預覽
      setPreview(URL.createObjectURL(file)); 
  
      // 更新 FormData，儲存檔案本身
      setAvatar((prev) => ({
        ...prev,
        avatar: file, // 儲存檔案對象
      }));
    }
  };
  // 取得用戶資料
  const getUserData = async () => {
    try {
      console.log(auth.token); // 在發送請求前檢查 token
      const response = await fetch(`http://localhost:3001/auth/members/api/${auth.id}`, {
        
        method: "GET",
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      
      const data = await response.json();

      
      
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
  src={preview || `${AVATAR_PATH}/${user?.avatar}`}
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
              <div className={styles.checkboxGroup} onChange={(e) =>handleSportChange(e.target.value)}>
              <label>喜愛運動：</label>
              <label>
                    <input
                      type="checkbox"
                      value="1"
                      checked={sport.includes("1")}
                      onChange={(e) => handleSportChange(e.target.value)}
                    />
                籃球
              </label>
              <label>
                <input type="checkbox" value="2" checked={sport.includes("2")} 
                  onChange={(e) => handleSportChange(e.target.value)} 
                  />
                排球
              </label>
              <label>
                <input type="checkbox" value="3" checked={sport.includes("3")} 
                    onChange={(e) => handleSportChange(e.target.value)} 
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
