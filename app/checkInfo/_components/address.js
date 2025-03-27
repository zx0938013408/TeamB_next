'use client'

import { useState, useEffect } from 'react'
import styles from './address.module.css'
import { CITY_LIST } from "@/config/cityArea-api-path"
import { useCart } from '@/hooks/use-cart'

export default function AddressForm() {
  const { selectedCity, setSelectedCity, selectedArea, setSelectedArea, address, setAddress } = useCart()

  const [cityData, setCityData] = useState([]);
  const [cityList, setCityList] = useState([]); // 只保留唯一的城市
  const [areaList, setAreaList] = useState([]); // 區域列表
 

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
    <div className={styles.formFrame}>
      <div id="addressTitle" className={styles.addressName}>宅配地址</div>
      <div className={styles.city}>
        <div className={styles.name}>
          <select
            aria-labelledby="addressTitle"
            value={selectedCity}
            onChange={(e) => setSelectedCity(parseInt(e.target.value, 10))}
          >
            <option value="">請選擇縣市</option>
            {cityList.map((city) => (
            <option key={city.city_id} value={city.city_id}>
              {city.city_name}
            </option>
          ))}
          </select>
        </div>

        <div className={styles.name}>
          <select
            aria-labelledby="addressTitle"
            value={selectedArea}
            onChange={(e) => setSelectedArea(parseInt(e.target.value, 10))}
            disabled={!selectedCity}  // 當沒有選擇縣市時禁用區域選項
          >
           <option value="">請選擇區域</option> {/* ✅ 固定預設選項 */}
           {areaList.map((area) => (
            <option key={area.area_id} value={area.area_id}>
              {area.area_name}
            </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.street}>
        <input
          type="text"
          aria-labelledby="addressTitle"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="請輸入詳細地址"
        />
      </div>
    </div>
  )
}

