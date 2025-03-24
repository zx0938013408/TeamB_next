'use client'

// import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import styles from '@/app/cart/cart.module.css'
import checkInfo from './checkInfo.module.css'
import ShipMethod from './_components/shipMethod'
import PayMethod from './_components/payMethod'
import Recipient from './_components/recipient'
import Button1 from '../cart/_components/button1'
import Button2 from '../cart/_components/button2'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

// import TableHeader from '../cart/_components/TableHeader'

export default function CheckInfoPage() {
  // 從useCart解構所需的context的value屬性
  const {
    selectedItems,
    selectedItemsCount,
    selectedItemsTotalAmount,
    shippingCost,
    finalTotal,
  } = useCart()

  return (
    <>
      <Header/>
      <Navbar/>
      <div className={styles.list}>
        {/* step */}
        <div className={styles.stepContainer}>
          <div className={styles.stepper}>
            <div className={styles.stepper2}>
              <div className={styles.inline}>
                <div className={styles.leftDivider}></div>
                <div className={styles.buttonIcon}>
                  <div className={styles.icon}>
                    <svg
                      className={styles.check}
                      width={17}
                      height={16}
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.8333 4L6.49996 11.3333L3.16663 8"
                        stroke="#FFF"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <div className={styles.rightDivider}></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step} style={{ color: '#528F7C' }}>
                  確認購物車清單
                </div>
              </div>
            </div>

            <div className={styles.stepper2}>
              <div className={styles.inline}>
                <div className={styles.leftDivider2}></div>
                <div className={styles.buttonIcon}>
                  <div
                    className={styles.icon}
                    style={{
                      background: '#528F7C',
                      border: '2px solid #528F7C',
                    }}
                  >
                    <span
                      className={styles.stepNumber}
                      style={{ color: '#FFF' }}
                    >
                      2
                    </span>
                  </div>
                </div>
                <div
                  className={styles.rightDivider}
                  style={{ background: '#6C7275' }}
                ></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step} style={{ color: '#528F7C' }}>
                  填寫訂購資訊
                </div>
              </div>
            </div>

            <div className={styles.stepper2}>
              <div className={styles.inline}>
                <div
                  className={styles.leftDivider2}
                  style={{ background: '#6C7275' }}
                ></div>
                <div className={styles.buttonIcon}>
                  <div
                    className={styles.icon}
                    style={{
                      background: '#ffffff',
                      border: '2px solid #6C7275',
                    }}
                  >
                    <span className={styles.stepNumber}>3</span>
                  </div>
                </div>
                <div
                  className={styles.rightDivider2}
                  style={{ color: '#6C7275' }}
                ></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step}>訂單成立</div>
              </div>
            </div>
          </div>
        </div>

        <div className={checkInfo.title}>
          <div className={checkInfo.titleName}>訂購資訊</div>
        </div>
        <div className={checkInfo.method}>
          {/* 收件人資料 */}
          <div className={checkInfo.secTitle}>收件人資料</div>
          <Recipient />
          {/* 選擇運送方式 */}
          <div className={checkInfo.secTitle}>付款方式</div>
          <PayMethod />
          {/* 選擇付款方式 */}
          <div className={checkInfo.secTitle}>運送方式</div>
          <ShipMethod />
        </div>

        {/* 訂單詳情 */}
        <table title="購物車">
          <thead className={styles.thead}>
            <tr>
              <th className={styles.titlePicture}></th>
              <th className={styles.titleName}>商品名稱</th>
              <th className={styles.titleSpec}>規格</th>
              <th className={styles.titlePrice}>單價</th>
              <th className={styles.titleCount}>數量</th>
              <th className={styles.titleSuntotal}>小計</th>
            </tr>
          </thead>

          <tbody>
            {selectedItems.map((selectedItem) => {
              const { id, picture, name, size, color, price, count } =
                selectedItem

              return (
                <tr className={checkInfo.item} key={id}>
                  <td>
                    <img src={picture} alt={name} />
                  </td>
                  <td className={checkInfo.name}>{name}</td>
                  <td className={styles.spec}>
                    <p>{size}</p>
                    <p>{color}</p>
                  </td>
                  <td className={styles.price}>NT${price.toLocaleString()}</td>
                  <td className={styles.count}>
                    <div className={styles.quantityControls}>
                      <input
                        className={styles.input}
                        type="text"
                        value={count}
                        readOnly
                      />
                    </div>
                  </td>
                  <td className={styles.subTotal}>
                    NT${(count * price).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className={styles.checkTotal}>
          <div className={styles.money}>
            <span>總數量:</span>
            <div className={styles.amount}>{selectedItemsCount}</div>個
          </div>
          <div className={styles.money}>
            <span>商品總金額:</span>
            <div className={styles.amount}>
              NT${selectedItemsTotalAmount.toLocaleString()}
            </div>
          </div>
          <div className={styles.money}>
            <span>運費總金額:</span>
            <div className={styles.amount}>NT${shippingCost}</div>
          </div>
          <div className={styles.money}>
            <span>付費總金額:</span>
            <div className={styles.amount}>
              NT${finalTotal.toLocaleString()}
            </div>
          </div>
        </div>

        {/* 按鈕 */}
        <div className={styles.btn}>
          <Button1 text="返回購物車" href="/cart" />
          <Button2 text="結帳" href="/orderResult" />
        </div>
      </div>
      <Footer/>
    </>
  )
}
