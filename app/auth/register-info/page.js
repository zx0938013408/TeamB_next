"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/auth/register-info.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import {MB_CITY_GET ,MB_REGISTER_GET,MB_AREA_GET} from "../../../config/auth.api";
   

const RegisterInfo = () => {


    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedGender, setSelectedGender] = useState("");
    const [id_card, setId_card] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [preview, setPreview] = useState(""); // 🔹 存圖片預覽 URL
    const [school, setSchool] = useState("");
    const [birthday_date, setBirthday_date] =useState("");
    const [cities, setCities] = useState([]);// 城市資料
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [areas, setAreas] = useState([]);    // 用來儲存區域資料
    const [avatar, setAvatar] = useState([]);    // 用來儲存區域資料
    const router = useRouter(); // 用於導航
    const [error, setError] = useState("");
  

    const idCardRegex = /^[0-9]{4}$/;
    const phoneRegex = /^09\d{8}$/;

    const validateIdCard = (idCard) => {
      return idCardRegex.test(idCard);
    };
    
    const validatePhone = (phone) => {
      return phoneRegex.test(phone);
    };

    const addressRegex = /^[\u4e00-\u9fa50-9]{5,}$/;  // 只允許數字和國字，且至少5個字符
    const validateAddress = (address) => {
      return addressRegex.test(address);
    };
    
      useEffect(() =>{
        const fetchCities = async()=>{
          try{
            const response = await fetch(MB_CITY_GET);
            const data = await response.json();
            if(data.success){
              setCities(data.data)
            }
          }catch(error){
            console.error("Error fetching areas:", error);
          }
        };
        fetchCities();
      }, []); 

      const handleCityChange = async (cityId) => {
        setSelectedCity(cityId);  // 更新選擇的縣市
        try {
          const response = await fetch(`${MB_AREA_GET}/${cityId}`);
          const data = await response.json();
          if (data.success) {
            setAreas(data.data);  // 根據選擇的縣市更新區域資料
          }
        } catch (error) {
          console.error("Error fetching areas:", error);
        }
      };


    


    // 更新選中的運動
    const handleSportChange = (sportId) => {
      setSelectedSports((prev) =>
        prev.includes(sportId) ? prev.filter((id) => id !== sportId) : [...prev, sportId]
      );
    };
  
    // 處理上傳頭像
    const handleAvatarChange = (e) => {//用戶選擇新的檔案時被
      const file = e.target.files[0]; //選擇的第一個檔案
      if (file) {         //如果 file 存在，即用戶選擇了檔案，則進行後續操作
        // 顯示圖片預覽
        setPreview(URL.createObjectURL(file));   //預覽圖的狀態:創建一個指向檔案的 URL，用來顯示預覽圖片。這個 URL 只在瀏覽器會話中有效
    
        // 更新 FormData，儲存檔案本身
        setAvatar((prev) => ({
          ...prev,
          avatar: file, // 儲存檔案對象
        }));
      }
    };
    //這裡使用了 setAvatar 函式來更新 avatar 狀態。prev 是之前的狀態（avatar），...prev 用來保留先前的屬性，並更新 avatar 屬性為選擇的檔案。
  
    
    // 提交表單
    const handleSubmit = async (event) => {
      event.preventDefault();

      let errors = {};

      if (!validatePhone(phone)) {
        setError ("手機格式不正確");
        return;
      };

      if (!validateAddress(address)) {
        setError("地址格式不正確，請填寫有效地址");
        return;
      };

      if (!validateIdCard(id_card)) {
        setError("身分證後四碼格式不正確");
        return;
      };

   

      if (Object.keys(errors).length > 0) {
        setError(errors); // 更新錯誤訊息
        return; // 阻止表單提交
      }



      const formData = new FormData();
      const res = JSON.parse(localStorage.getItem("registerTemp"));
      formData.append("avatar", avatar.avatar);
      formData.append("gender", selectedGender);
      formData.append("sport", selectedSports.join(","));
      formData.append("id_card", id_card);
      formData.append("city", selectedCity);
      formData.append("district", selectedDistrict);
      formData.append("address", address);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("school", school);
      formData.append("birthday_date", birthday_date);
      formData.append("email",res.email)
      formData.append("password",res.password)
    
      
      try {
        const response = await axios.post(`${MB_REGISTER_GET}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("註冊成功！");
        router.push("/auth/login");

      } catch (error) {
        alert("註冊失敗！");
        console.error("註冊失敗，錯誤訊息:", error);  // 打印出錯誤訊息
      }
    };



    return (
        <div className={styles.container}>
  {/* 左側區塊 (綠色區塊) */}
  <div className={styles.leftSection}>
    <h1>TeamB</h1>
    <div className={styles.separator}></div>
    <p>請填寫會員基本資料。</p>
  </div>
     
          <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
            {/* 頭像上傳區域 */}
            <div className={styles.avatarNameContainer}>
              <div className={styles.avatarContainer}>
              <img src={preview || ""}  alt="頭像預覽" className={styles.avatarPreview} />
                <input id="fileInput" name="avatar" type="file" accept="image/*" className={styles.hiddenFileInput} onChange={handleAvatarChange} />
                <button type="button" onClick={() => document.getElementById("fileInput").click()} className={styles.uploadButton}>
                  上傳頭像
                </button>
              </div>
              <input
                className={styles.inputBox}
                type="text"
                name="name"
                placeholder="姓名"
                required
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <div className={styles.genderSportContainer}>
  {/* 性別選擇 */}
  <select className={styles.selectBox} name="gender" required onChange={(e) => setSelectedGender(e.target.value)}>
              <option value="" hidden> 性別 </option>
              <option value="男"> 男 </option>
              <option value="女"> 女 </option>
              <option value="其他"> 其他 </option>
            </select>

            {/* 喜愛運動選擇 */}
            <div className={styles.checkboxGroup} onChange={(e) =>handleSportChange(e.target.value)}>
              <label>喜愛運動：</label>
              <label>
                <input type="checkbox" value="1" />
                籃球
              </label>
              <label>
                <input type="checkbox" value="2"  />
                排球
              </label>
              <label>
                <input type="checkbox" value="3" />
                羽球
              </label>
            </div>
            </div>
          
<div className={styles.row}>
  <input
    className={styles.inputBox}
    type="date"
    name="birthday_date"
    placeholder="生日"
    required
    onChange={(e) => setBirthday_date(e.target.value)}
  />
  <input
    className={styles.inputBox}
    type="text"
    name="phone"
    placeholder="手機"
    required
    onChange={(e) => setPhone(e.target.value)}
  />
</div>

   {/* 地址：縣市 + 地區 + 地址 */}
   <div>
        <select className={styles.cityBox} required value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
          <option value="" required>選擇縣市</option>
          {cities.map((city) => (
    <option key={city.id} value={city.id}>{city.name}</option>
  ))}
        </select>

        <select  className={styles.cityBox} required value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)}>
        <option value="" >選擇地區</option>
        {areas.map((area) => (
          <option key={area.area_id} value={area.area_id} >
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

<div className={styles.row}>
  <input
    className={styles.inputBox}
    type="text"
    name="id_last4"
    placeholder="身分證後4碼"
    required
    onChange={(e) => setId_card(e.target.value)}
  />
  <input
    className={styles.inputBox}
    type="text"
    name="elementary_school"
    placeholder="國小的學校"
    required
    onChange={(e) => setSchool( e.target.value)}
  />
</div>


            <div className={styles.submitSection}>
            <div className={styles.errorArea}>
            
            {error && <p className={styles.errorText}>{error}</p>}
            </div>

              <button type="submit" className={styles.submitButton}>
                完成
              </button>
            </div>
          </form>
          </div>
    
    );
};

export default RegisterInfo;
