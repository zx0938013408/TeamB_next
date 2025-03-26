"use client";
import { useEffect, useState } from "react";
import Styles from "@/styles/city-area/city-area.module.css";
import { COURT_LIST } from "@/config/court-api-path";

export default function CourtList({ selectedCity, selectedArea }) {
  const [courtList, setCourtList] = useState([]);
  const [filteredCourts, setFilteredCourts] = useState([]);

  // 取得所有場地資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(COURT_LIST);
        const obj = await r.json();
        if (obj.success) {
          setCourtList(obj.rows); // 儲存完整場地資料
        }
      } catch (error) {
        console.warn("載入場地失敗：", error);
      }
    };

    fetchData();
  }, []);

  // 當選擇的縣市 or 區域變動時重新篩選
  useEffect(() => {
    if (selectedCity && selectedArea) {
      const filtered = courtList.filter(
        (court) =>
          parseInt(court.city_id) === parseInt(selectedCity) &&
          parseInt(court.area_id) === parseInt(selectedArea)
      );
      setFilteredCourts(filtered);
    } else {
      setFilteredCourts([]); // 尚未選完，不顯示
    }
  }, [selectedCity, selectedArea, courtList]);

  return (
    <div className="mt-3">
      {filteredCourts.length > 0 ? (
        <ul className={Styles.courtList}>
          {filteredCourts.map((court) => (
            <li key={court.court_id} className={Styles.courtItem}>
              <p><strong>{court.court_name}</strong>（{court.sport_name}）</p>
              <p>{court.city_name} {court.area_name} - {court.address}</p>
              <p>場地類型：{court.court_type}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">請選擇縣市與區域以顯示場地。</p>
      )}
    </div>
  );
}