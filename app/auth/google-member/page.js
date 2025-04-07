"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import styles from "../../../styles/auth/member-edit.module.css";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import { useRouter } from "next/navigation";
import { MB_CITY_GET, MB_AREA_GET } from "../../../config/auth.api";
import { AVATAR_PATH } from "@/config/auth.api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MemberEditGoogle = () => {
  const { auth, updateUserData, logout } = useAuth();
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [name, setName] = useState(auth.name || "");
  const [gender, setGender] = useState(auth.gender || "");
  const [phone, setPhone] = useState(auth.phone || "");
  const [address, setAddress] = useState(auth.address || "");
  const [cityId, setCityId] = useState(auth.city_id || "");
  const [areaId, setAreaId] = useState(auth.area_id || "");
  const [avatar, setAvatar] = useState(auth.avatar || "");
  const [sport, setSport] = useState(auth.sport || "");
  const [birthday_date, setBirthday_date] = useState(
    auth.birthday_date ? auth.birthday_date.slice(0, 10) : ""
  );
  const router = useRouter();
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth && auth.id) {
      setName(auth.name || "");
      setGender(auth.gender || "");
      setPhone(auth.phone || "");
      setAddress(auth.address || "");
      setCityId(auth.city_id || "");
      setAreaId(auth.area_id || "");
      setAvatar(auth.avatar || "");
      setSport((auth.sport || "").replace(/\s/g, ""));
      setBirthday_date(auth.birthday_date ? auth.birthday_date.slice(0, 10) : "");

      if (auth.city_id) {
        handleCityChange(auth.city_id);
      }
    }
  }, [auth]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(MB_CITY_GET);
        const data = await response.json();
        if (data.success) setCities(data.data);
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
      if (data.success) setAreas(data.data);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleSportChange = (sportId) => {
    setSport((prev) => {
      const currentSports = prev || "";
      if (currentSports.includes(sportId)) {
        return currentSports.split(",").filter((id) => id !== sportId).join(",");
      } else {
        return currentSports ? `${currentSports},${sportId}` : sportId;
      }
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("請輸入姓名");
    if (!phone.match(/^09\d{8}$/)) return setError("請輸入正確的手機號碼");
    if (!gender) return setError("請選擇性別");
    if (!birthday_date) return setError("請選擇生日");
    if (!cityId || !areaId) return setError("請選擇縣市與地區");
    if (!address.trim()) return setError("請輸入地址");

    const validSports = ["1", "2", "3"];
    const sportArray = sport.split(",");
    for (let s of sportArray) {
      if (!validSports.includes(s)) return setError("請選擇有效的運動");
    }

    setError("");
    const result = await updateUserData({
      ...auth,
      name,
      gender,
      birthday_date,
      phone,
      address,
      city_id: cityId,
      area_id: areaId,
      avatar,
      sport,
    });

    if (result === true) {
      toast.success("會員資料更新成功！");
      router.push("/auth/member");
    }
  };

  if (!auth || !auth.id) {
    return <div className={styles.dotLoading}><span></span><span></span><span></span></div>;
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.sidebar}></div>
        <div className={styles.mainContent}>
          <div className={styles.title}>編輯個人檔案（Google）</div>
          <div className={styles.rightSection}>
            <form id={styles.profileForm} onSubmit={handleSubmit}>
              <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                <img
  src={
    preview
      ? preview
      : auth?.avatar?.startsWith("http")
        ? auth.avatar
        : `${AVATAR_PATH}/${auth?.avatar || "imgs/main.png"}`
  }
  alt="User Avatar"
  className={styles.avatar}
/>
                </div>
                <label htmlFor="avatar-upload" className={styles.uploadLabel}>更換頭像</label>
                <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
              </div>

              <div className={styles.form}>
                <input className={styles.inputBox} type="text" value={name} placeholder="姓名" onChange={(e) => setName(e.target.value)} />
                <select className={styles.selectBox} value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="" disabled hidden>性別</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                  <option value="其他">其他</option>
                </select>
                <div className={styles.row}>
                  <input
                    className={styles.inputBox}
                    type="text"
                    name="birthday_date"
                    placeholder="生日：年/月/日"
                    required
                    value={birthday_date}
                    onChange={(e) => setBirthday_date(e.target.value)}
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = 'text';
                    }}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className={styles.checkboxGroup}>
                  <label>喜愛運動：</label>
                  {["1", "2", "3"].map((id) => (
                    <label key={id}>
                      <input type="checkbox" value={id} checked={sport.includes(id)} onChange={() => handleSportChange(id)} />
                      {id === "1" ? "籃球" : id === "2" ? "排球" : "羽球"}
                    </label>
                  ))}
                </div>
                <input className={styles.inputBox} type="text" value={phone} placeholder="手機" onChange={(e) => setPhone(e.target.value)} />
                <div>
                  <select className={styles.cityBox} value={cityId} onChange={(e) => handleCityChange(e.target.value)}>
                    <option value="">選擇縣市</option>
                    {cities.map((city) => <option key={city.id} value={city.id}>{city.name}</option>)}
                  </select>
                  <select className={styles.cityBox} value={areaId} onChange={(e) => setAreaId(e.target.value)}>
                    <option value="">選擇地區</option>
                    {areas.map((area) => <option key={area.area_id} value={area.area_id}>{area.name}</option>)}
                  </select>
                  <input className={styles.addressBox} type="text" value={address} placeholder="請輸入詳細地址" onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className={styles.confirmSection}>
                  {error && <div className={styles.errorMessage}>{error}</div>}
                  <button type="submit" className={styles.confirmBtn}>確認</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberEditGoogle;
