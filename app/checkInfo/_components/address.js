'use client'

import { useState } from 'react'
import styles from './address.module.css'

export default function AddressForm() {
  // const [city, setCity] = useState('')
  // const [district, setDistrict] = useState('')
  // const [address, setAddress] = useState('')
  const [addressInfo, setAddressInfo] = useState({
    city: '',
    district: '',
    address: '',
  })

  const handleChange = (field, value) => {
    setAddressInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const cities = ['台北', '台中', '高雄']

  const districts = {
    台北: ['大安區', '信義區', '中山區'],
    台中: ['西屯區', '南屯區', '北區'],
    高雄: ['鼓山區', '左營區', '苓雅區'],
  }

  return (
    <div className={styles.formFrame}>
      <div id="addressTitle" className={styles.addressName}>宅配地址</div>
      <div className={styles.city}>
        <div className={styles.name}>
          <select
            aria-labelledby="addressTitle"
            value={addressInfo.city}
            onChange={(e) => {
              handleChange('city', e.target.value)
              handleChange('district', '') // 選擇新城市時重置區域
            }}
          >
            <option value="">請選擇城市</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.name}>
          <select
            aria-labelledby="addressTitle"
            value={addressInfo.district}
            onChange={(e) => handleChange('district', e.target.value)}
            disabled={!addressInfo.city}
          >
            <option value="">請選擇市區</option>
            {addressInfo.city &&
              districts[addressInfo.city].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className={styles.street}>
        {/* <label htmlFor="address">詳細地址</label> */}
        <input
          type="text"
          aria-labelledby="addressTitle"
          value={addressInfo.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="請輸入詳細地址"
        />
      </div>

      {/* <button>儲存</button> */}
    </div>
  )
}


