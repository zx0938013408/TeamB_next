"use client";
import { useEffect, useState } from "react";
import Styles from "@/styles/city-area/city-area.module.css";

export default function AreaSelector({ selectedCity, selectedArea, setSelectedArea, cityData, handleInputChange, selectedSport, courtList }) {
  const [areaList, setAreaList] = useState([]);

  useEffect(() => {
    if (!selectedCity || !selectedSport) return;
  
    const filteredAreas = cityData.filter(
      (item) => Number(item.city_id) === Number(selectedCity)
    );
  
    const areasWithCourts = filteredAreas.filter((area) =>
      courtList.some(
        (court) =>
          Number(court.city_id) === Number(selectedCity) &&
          Number(court.area_id) === Number(area.area_id) &&
          Number(court.sport_type_id) === Number(selectedSport)
      )
    );
  
    setAreaList(
      areasWithCourts.map((area) => ({
        area_id: area.area_id,
        area_name: area.name || area.area_name, // ✅ 不要寫錯 key
      }))
    );
  
    setSelectedArea("");
  }, [selectedCity, selectedSport, cityData, courtList]);

  useEffect(() => {
    console.log("🏀 selectedSport", selectedSport);
    console.log("🏙 selectedCity", selectedCity);
  }, [selectedCity, selectedSport]);

  return (
    <span>
      <select
        value={selectedArea}
        className={Styles.border}
        name="area_id"
        onChange={(e) => {
          setSelectedArea(e.target.value)
          handleInputChange?.(e);
          }}
        disabled={!selectedCity}
      >
      {
        !selectedCity ? (
          <option value="">請選擇區域</option>
        ) : (
          <>
            <option value="">請選擇區域</option>
            {areaList.map((area) => (
              <option key={area.area_id} value={area.area_id}>
                {area.area_name}
              </option>
            ))}
          </>
        )
      }
      </select>
    </span>
  );
}