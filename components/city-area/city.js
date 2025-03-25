"use client";
import { useEffect, useState } from "react";
import { CITY_LIST } from "@/config/cityArea-api-path";
import Styles from "@/styles/city-area/city-area.module.css";

export default function CitySelector({ selectedCity, setSelectedCity, setCityData }) {
  const [cityList, setCityList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(CITY_LIST);
        const obj = await r.json();
        if (obj.success) {
          setCityData(obj.rows); // 把完整 cityData 回傳給父層
          const cities = Array.from(
            new Map(obj.rows.map((item) => [item.city_id, item.city_name]))
          ).map(([id, name]) => ({ city_id: id, city_name: name }));
          setCityList(cities);
        }
      } catch (error) {
        console.warn("載入失敗：", error);
      }
    };

    fetchData();
  }, [setCityData]);

  return (
    <span className={Styles.distance}>
      <select
        value={selectedCity}
        className={Styles.border}
        onChange={(e) => setSelectedCity(e.target.value)}
      >
        <option value="">請選擇縣市</option>
        {cityList.map((city) => (
          <option key={city.city_id} value={city.city_id}>
            {city.city_name}
          </option>
        ))}
      </select>
    </span>
  );
}