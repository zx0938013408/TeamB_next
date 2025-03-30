'use client'

import { useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import styles from './shipMethod.module.css'
import ComponentsAddress from './address'
import Store from './store'

export default function ShipMethod() {
  // const [shippingMethod, setShippingMethod] = useState('')
  // const [shippingCost, setShippingCost] = useState(0)
  const { shippingMethod, setShippingMethod, shippingCost, setShippingCost } =
    useCart()

  //  被選擇的選項
  const options = [
    { id: 1, label: '宅配', shipping: 100 },
    { id: 2, label: '超商取貨(7-ELEVEN)', shipping: 60 },
  ]

  // 根據選擇的運送方式顯示不同的表單
  const renderForm = (ShipMethod) => {
    switch (ShipMethod) {
      case 1:
        return <ComponentsAddress />
      case 2:
        return <Store />
      default:
        return null
    }
  }

  // 頁面加載時從 localStorage 讀取運送方式和運費
  useEffect(() => {
    const savedMethod = localStorage.getItem('shippingMethod')
    const savedCost = localStorage.getItem('shippingCost')

    if (savedMethod) {
      setShippingMethod(Number(savedMethod))
    }
    if (savedCost) {
      setShippingCost(parseInt(savedCost, 10))
    }
  }, [])

  // 每次選擇運送方式時保存到 localStorage
  useEffect(() => {
    if (shippingMethod) {
      localStorage.setItem('shippingMethod', shippingMethod)
      localStorage.setItem('shippingCost', shippingCost.toString())
    }
  }, [shippingMethod, shippingCost])

  return (
    <>
      {/* 主要容器，包含運送選項與表單 */}
      <div className={styles.shipContainer2}>
      {/* 選項列表 */}
      <div className={styles.optionsContainer}>
        {options.map((v) => (
          <div key={v.label} className={styles.optionContainer}>
            <label htmlFor={v.id} className={styles.shipMethod}>
              <input
                id={v.id}
                type="radio"
                value={v.id}
                checked={shippingMethod === v.id}
                onChange={() => {
                  setShippingMethod(v.id)
                  setShippingCost(v.shipping)
                }}
              />
              <div>
                <div>{v.label}</div>
                <div className={styles.payment}>運費: NT${v.shipping}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      {/* **選擇後顯示對應表單 (放在選項後面)** */}
      {shippingMethod && (
        <div className={styles.formContainer}>{renderForm(shippingMethod)}</div>
      )}
      </div>
    </>
    
  )
}
