"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/auth/register-info.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";


const RegisterInfo = () => {

    const [sports, setSports] = useState([]); // 運動資料
    const [cities, setCities] = useState([]); // 城市資料
    const [selectedSports, setSelectedSports] = useState([]);
    const [selectedGender, setSelectedGender] = useState("");
    const [idCard, setIdCard] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [address, setAddress] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [preview, setPreview] = useState(""); // 🔹 存圖片預覽 URL
    const [school, setSchool] = useState("");
    const [birthday_date, setBirthday_date] =useState("");
  
    useEffect(() => {
      // 從後端API獲取運動資料
      axios.get("/api/sports").then(response => {
        setSports(response.data);
      });
      // 從後端API獲取城市資料
      axios.get("/api/cities").then(response => {
        setCities(response.data);
      });
    }, []);

    
  
    // 更新選中的運動
    const handleSportChange = (sportId) => {
      setSelectedSports((prev) =>
        prev.includes(sportId) ? prev.filter((id) => id !== sportId) : [...prev, sportId]
      );
    };
  
    // 全選運動
    const handleSelectAllSports = () => {
      if (selectedSports.length === sports.length) {
        setSelectedSports([]);
      } else {
        setSelectedSports(sports.map((sport) => sport.id)); // 假設運動資料有 id
      }
    };

    const handleCityChange = (cityId) => {
      setSelectedCity(cityId);
      // 呼叫後端 API 獲取對應 cityId 的區域資料
    };
  
    // 處理上傳頭像
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
  
    // 提交表單
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("avatar", avatar);
      formData.append("gender", selectedGender);
      formData.append("sports", selectedSports.join(","));
      formData.append("idCard", idCard);
      formData.append("city", selectedCity);
      formData.append("district", selectedDistrict);
      formData.append("address", address);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("school", school);
      formData.append("birthday_date", birthday_date);
    
      try {
        const response = await axios.post("/api/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("註冊成功！");
        router.push("/auth/join");

      } catch (error) {
        alert("註冊失敗！");
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
                <input id="fileInput" type="file" accept="image/*" className={styles.hiddenFileInput} onChange={handleAvatarChange} />
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
              <option value="male"> 男 </option>
              <option value="female"> 女 </option>
              <option value="other"> 其他 </option>
            </select>

            {/* 喜愛運動選擇 */}
            <div className={styles.checkboxGroup}>
              <label>喜愛運動：</label>
              <label>
                <input type="checkbox" value="籃球" />
                籃球
              </label>
              <label>
                <input type="checkbox" value="排球"  />
                排球
              </label>
              <label>
                <input type="checkbox" value="羽球" />
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
        <select className={styles.cityBox} value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
          <option value="">選擇縣市</option>
          {cities.map((city) => (
    <option key={city.id} value={city.id}>{city.name}</option>
  ))}
        </select>

        <select  className={styles.cityBox} value={selectedDistrict}onChange={(e) => setSelectedDistrict(e.target.value)}>
        <option value="">選擇地區</option>
          {/* 根據 selectedCity 獲取對應地區資料 */}
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
    onChange={(e) => setIdCard(e.target.value)}
  />
  <input
    className={styles.inputBox}
    type="text"
    name="elementary_school"
    placeholder="國小的學校"
    required
    onChange={(e) => setFormData({ ...formData, elementary_school: e.target.value })}
  />
</div>


            {/* 送出按鈕 */}
            <div className={styles.submitSection}>
              <button type="submit" className={styles.submitButton}>
                完成
              </button>
            </div>
          </form>
          </div>
    
    );
};

export default RegisterInfo;
