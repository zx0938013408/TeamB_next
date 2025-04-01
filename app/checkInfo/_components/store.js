'use client'

import styles from './address.module.css'
import btnStyles from '@/app/cart/_components/button.module.css'
import { useShip711StoreOpener } from '@/app/ship/_hooks/use-ship-711-store'
import {
  nextUrl,
  // eslint-disable-next-line no-unused-vars
  apiURL,
} from '@/config'

export default function ShipPage() {
  // useShip711StoreOpener的第一個傳入參數是"伺服器7-11運送商店用Callback路由網址"
  // 指的是node(express)的對應api路由。詳情請見說明文件:
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    `${nextUrl}/ship/api`, // 直接用Next提供的api路由
    //`${apiUrl}/shipment/711`, // 也可以用express伺服器的api路由
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  )


  return (
    <>
      <div className={styles.formFrame}>
        <div className={styles.addressName}>新增7-11門市</div>

        <div className={styles.name}>
          {/* <label htmlFor="storeName">門市名稱</label> */}
          <input  type="text"
          placeholder="門市名稱"
          value={store711.storename} disabled />
        </div>

        <div className={styles.street}>
          {/* <label htmlFor="storeAddress">門市地址</label> */}
          <input  type="text"
          placeholder="門市地址"
          value={store711.storeaddress} disabled />
        </div>
       
        <button className={btnStyles.btn3} onClick={() => {
            openWindow()
          }}>選擇門市</button>
       
      </div>
    </>
  )
}
