'use client'

// import { useState} from 'react'
import { useCart } from '@/hooks/use-cart'
import styles from './shipMethod.module.css'

export default function PayMethod() {
  const { selectedPayMethod, setSelectedPayMethod } = useCart()
  //  被選擇的選項
  // const options = ['貨到付款', '信用卡/金融卡']
  const options = [ 
    { id: 1, label: '貨到付款' },
    { id: 2, label: '信用卡/金融卡' }
  ]
 
  

  return (
    <>
     
      <div className={styles.shipContainer}>
        <div className={styles.radioFrame }>    
            {options.map((option) => {
            return (
                <label
                htmlFor={`payMethod-${option.id}`}
                className={styles.payMethod}
                // 只有靜態選項才能用索引值當key
                key={option.id}
                >
                <input
                    id={`payMethod-${option.id}`}
                    type="radio"
                    // 觸發事件時用於設定狀態
                    value={option.id}
                    // 用布林值決定是否有被選中
                    checked={selectedPayMethod === option.id}
                    // 使用者操作時 --> 更動到狀態
                    onChange={(e) => {
                    setSelectedPayMethod(Number(e.target.value))
                    }}
                />
                {option.label}
                </label>
                  
            )
            
            })}</div>
        
        </div>
    </>
  )
}
