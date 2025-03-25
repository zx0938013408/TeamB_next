'use client'

// import { useState} from 'react'
import { useCart } from '@/hooks/use-cart'
import styles from './shipMethod.module.css'

export default function PayMethod() {
  const { selectedPayMethod, setSelectedPayMethod } = useCart()
  //  被選擇的選項
  const options = ['貨到付款', '信用卡/金融卡']

  

  return (
    <>
      {/* <div className={styles.title2}>
        <div className={styles.titleName2}>付款方式</div>
      </div> */}
      <div className={styles.shipContainer}>
        <div className={styles.radioFrame }>    
            {options.map((v, i) => {
            return (
                <label
                htmlFor={`payMethod-${i}`}
                className={styles.payMethod}
                // 只有靜態選項才能用索引值當key
                key={v}
                >
                <input
                    id={`payMethod-${i}`}
                    type="radio"
                    // 觸發事件時用於設定狀態
                    value={v}
                    // 用布林值決定是否有被選中
                    checked={selectedPayMethod === v}
                    // 使用者操作時 --> 更動到狀態
                    onChange={(e) => {
                    setSelectedPayMethod(e.target.value)
                    }}
                />
                {v}
                </label>
                  
            )
            
            })}</div>
        
        </div>
    </>
  )
}
