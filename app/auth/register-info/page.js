"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/auth/register-info.module.css";
import { useRouter } from "next/navigation";


const RegisterInfo = () => {

  const [preview, setPreview] = useState(""); // 🔹 存圖片預覽 URL
  const router = useRouter();
  const [formData, setFormData] = useState({
      email: "",
      password: "",
      name: "",
      gender: "",
      sport: "",
      birthday: "",
      phone: "",
      address: "",
      avatar: "",
  });

    // 讀取 localStorage
    useEffect(() => {
      const savedData = JSON.parse(localStorage.getItem("registerTemp"));
      if (savedData) {
          setFormData((prev) => ({
              ...prev,
              email: savedData.email,
              password: savedData.password,
          }));
      }
  }, []);


  //處理頭像上傳
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // 顯示圖片預覽
    setPreview(URL.createObjectURL(file)); 

    // 更新 FormData，儲存檔案本身
    setFormData((prev) => ({
      ...prev,
      avatar: file, // 儲存檔案對象
    }));
  }
};




// 處理 checkbox
const handleCheckboxChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      const updatedSport = prev.sport.includes(value)
        ? prev.sport.filter((s) => s !== value) // 如果已經有這項運動，則移除
        : [...prev.sport, value]; // 如果沒有，則新增
      // 將選中的運動轉換為以逗號分隔的字串
      const sportString = updatedSport.join(", ");
      return {
        ...prev,
        sport: sportString, // 儲存為字串
      };
    });
  };
  

// 處理表單提交
const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // 迭代並將資料附加到 FormData
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "sport") {
        formDataToSend.append(key, JSON.stringify(value)); // 轉換運動資料為 JSON 字串
      } else if (key === "avatar") {
        formDataToSend.append("avatar", value); // 添加頭像檔案
      } else {
        formDataToSend.append(key, value);
      }
    });
  
    try {
      // 發送註冊請求
      const res = await fetch("http://localhost:3001/api/register", {
        method: "POST",
        body: formDataToSend, // 傳送 FormData，瀏覽器會自動處理 Content-Type
      });


      const data = await res.json();  // 獲取後端回應
      if (data.success) {
        // 註冊成功，儲存 token 並跳轉到登入頁
        localStorage.setItem("token", data.token); // 儲存 token
        alert("成功註冊");
        router.push("/login");  // 跳轉到登入頁面
      } else {
        alert("註冊失敗：" + data.message); // 顯示錯誤訊息
      }
    } catch (error) {
      console.error("註冊錯誤:", error);  // 捕捉並顯示錯誤
    }
  };
  
  


const handleUploadClick = () => {
  document.getElementById("fileInput").click();
};


    return (
        <div className={styles.container}>
  {/* 左側區塊 (綠色區塊) */}
  <div className={styles.leftSection}>
    <h1>TeamB</h1>
    <div className={styles.separator}></div>
    <p>會員基本資料</p>
  </div>
     
          <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
            {/* 頭像上傳區域 */}
            <div className={styles.avatarNameContainer}>
              <div className={styles.avatarContainer}>
                <img src={preview || ""}  alt="頭像預覽" className={styles.avatarPreview} />
                <input id="fileInput" type="file" accept="image/*" className={styles.hiddenFileInput} onChange={handleFileChange} />
                <button type="button" onClick={handleUploadClick} className={styles.uploadButton}>
                  上傳頭像
                </button>
              </div>
              <input
                className={styles.inputBox}
                type="text"
                name="name"
                placeholder="姓名"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* 性別選擇 */}
            <select className={styles.selectBox} name="gender" required onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="" disabled hidden> 性別 </option>
              <option value="male"> 男 </option>
              <option value="female"> 女 </option>
              <option value="other"> 其他 </option>
            </select>

            {/* 喜愛運動選擇 */}
            <div className={styles.checkboxGroup}>
              <label>喜愛運動：</label>
              <label>
                <input type="checkbox" value="籃球" onChange={handleCheckboxChange} />
                籃球
              </label>
              <label>
                <input type="checkbox" value="排球" onChange={handleCheckboxChange} />
                排球
              </label>
              <label>
                <input type="checkbox" value="羽球" onChange={handleCheckboxChange}/>
                羽球
              </label>
              <label>
                <input type="checkbox" value="all" onChange={handleCheckboxChange}/>
                全部
              </label>
            </div>

            {/* 其他輸入框 */}
            <input
              className={styles.inputBox}
              type="text"
              name="birthday_date"
              placeholder="生日"
              required
              onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
            />
            <input
              className={styles.inputBox}
              type="text"
              name="phone"
              placeholder="手機"
              required
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <input
              className={styles.inputBox}
              type="text"
              name="address"
              placeholder="地址"
              required
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

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
