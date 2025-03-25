'use client'

import { useState, useEffect } from 'react'
import styles from './address.module.css'
import { CITY_LIST } from "@/config/cityArea-api-path"
import { useCart } from '@/hooks/use-cart'

export default function AddressForm() {
  const { selectedCity, selectedArea, address, updateAddress } = useCart()

  const [cityData, setCityData] = useState([]) 
  const [cityList, setCityList] = useState([]) 
  const [areaList, setAreaList] = useState([]) 

  // 取得縣市資料
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(CITY_LIST)
        const obj = await r.json()
        if (obj.success) {
          setCityData(obj.rows)
          const cities = Array.from(
            new Map(obj.rows.map((item) => [item.city_id, item.city_name]))
          ).map(([id, name]) => ({ city_id: id, city_name: name }))
          setCityList(cities)
        }
      } catch (error) {
        console.warn("載入失敗：", error)
      }
    }

    fetchData()
  }, [])

  // 當選擇縣市時，更新區域列表
  useEffect(() => {
    if (selectedCity) {
      // 篩選出與選擇縣市相關的區域
      const filteredAreas = cityData
        .filter((item) => item.city_id === parseInt(selectedCity))
        .map((item) => ({
          area_id: item.area_id,
          area_name: item.name,
        }))
      setAreaList(filteredAreas)
      // 清空區域選擇
      updateAddress({ city: selectedCity, area: "", address })
    } else {
      setAreaList([])  // 清空區域列表，當未選擇縣市時
    }
  }, [selectedCity, cityData, updateAddress])

  const handleCityChange = (e) => {
    const city = e.target.value
    // 更新選擇的縣市
    updateAddress({ city, area: "", address })
  }

  const handleAreaChange = (e) => {
    const area = e.target.value
    updateAddress({ city: selectedCity, area, address })
  }

  const handleAddressChange = (e) => {
    const newAddress = e.target.value
    updateAddress({ city: selectedCity, area: selectedArea, address: newAddress })
  }

  return (
    <div className={styles.formFrame}>
      <div id="addressTitle" className={styles.addressName}>宅配地址</div>
      <div className={styles.city}>
        <div className={styles.name}>
          <select
            aria-labelledby="addressTitle"
            value={selectedCity}
            onChange={handleCityChange}
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
            onChange={handleAreaChange}
            disabled={!selectedCity}  // 當沒有選擇縣市時禁用區域選項
          >
            <option value="">請選擇區域</option>
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
          onChange={handleAddressChange}
          placeholder="請輸入詳細地址"
        />
      </div>
    </div>
  )
}