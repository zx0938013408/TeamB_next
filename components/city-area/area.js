"use client";
import { useEffect, useState } from "react";
import Styles from "@/styles/city-area/city-area.module.css";

export default function AreaSelector({ selectedCity, selectedArea, setSelectedArea, cityData, handleInputChange }) {
  const [areaList, setAreaList] = useState([]);

  useEffect(() => {
    if (selectedCity) {
      const filteredAreas = cityData
        .filter((item) => item.city_id === parseInt(selectedCity))
        .map((item) => ({
          area_id: item.area_id,
          area_name: item.name,
        }));
      setAreaList(filteredAreas);
    }
  }, [selectedCity, cityData, setSelectedArea]);

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