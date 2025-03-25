"use client";

import { useState, useEffect } from "react";
import { CITY_LIST } from "@/config/cityArea-api-path";
import Styles from "@/styles/city-area/city-area.module.css"

export default function CityAreaPage() {
  const [cityData, setCityData] = useState([]);
  const [cityList, setCityList] = useState([]); // 只保留唯一的城市
  const [areaList, setAreaList] = useState([]); // 區域列表
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(CITY_LIST);
        const obj = await r.json();
        if (obj.success) {
          setCityData(obj.rows);
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
  }, []);

  useEffect(() => {
    // 根據選取的 city_id 篩選區域
    if (selectedCity) {
      const filteredAreas = cityData
        .filter((item) => item.city_id === parseInt(selectedCity))
        .map((item) => ({
          area_id: item.area_id,
          area_name: item.name,
        }));
      setAreaList(filteredAreas);
      setSelectedArea(""); // ✅ 切換縣市時清空區域選擇
    }
  }, [selectedCity, cityData]);

  return (
    <>
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

      <span>
        <select
          value={selectedArea}
          className={Styles.border}
          onChange={(e) => setSelectedArea(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">請選擇區域</option> {/* ✅ 固定預設選項 */}
          {areaList.map((area) => (
            <option key={area.area_id} value={area.area_id}>
              {area.area_name}
            </option>
          ))}
        </select>
      </span>

      {/* ✅ 顯示目前選擇 */}
      {/* <div>
        <p>選擇的城市 ID：{selectedCity}</p>
        <p>選擇的區域 ID：{selectedArea}</p>
      </div> */}
    </>
  );
}
