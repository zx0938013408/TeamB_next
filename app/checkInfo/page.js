'use client'

import { useEffect, useRef } from 'react'
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
import { isDev } from '@/config'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export default function CheckInfoPage() {

  // 從useCart解構所需的context的value屬性
  const {
    selectedItems,
    selectedItemsCount,
    selectedItemsTotalAmount,
    shippingCost,
    finalTotal,
    selectedPayMethod,
    setShippingMethod,
    shippingMethod,
    recipient,
    selectedCity, 
    selectedArea, 
    address 
  } = useCart()


  // 產生商品名稱字串（多個商品用逗號 `,` 分隔）
  const itemsString = selectedItems
    .map((item) => `${item.name}x${item.count}`)
    .join(',')

  // 檢查是否登入
    // const { isAuth } = useAuth()
    // 建立ref，用來放置form表單
    const payFormDiv = useRef(null)
    // 建立ref，用來放置金額
    // const amountRef = useRef(null)
    // 建立ref，用來放置商品名稱
    // const itemsRef = useRef(null)
   


    // 建立form表單
    const createEcpayForm = (params, action) => {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = action
      for (const key in params) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = params[key]
        form.appendChild(input)
      }
      // 回傳form表單的物件參照
      return payFormDiv.current.appendChild(form)
      // 以下是直接送出表單的方式
      // form.submit()
    }
  
    const handleEcpay = async () => {

      // 先連到node伺服器後端，取得綠界金流付款網址
      const res = await fetch(
        `http://localhost:3001/ecpay-test-only?amount=${finalTotal}&items=${itemsString}`,
        {
          method: 'GET',
          // 讓fetch能夠傳送cookie
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
  
      const resData = await res.json()
  
      if (isDev) console.log(resData)
  
      if (resData.status === 'success') {
        // 建立表單，回傳的是表單的物件參照
        const payForm = createEcpayForm(resData.data.params, resData.data.action)
  
        if (isDev) console.log(payForm)
  
        if (window.confirm('確認要導向至ECPay(綠界金流)進行付款?')) {
          //送出表單
          payForm.submit()
        }
      } else {
        toast.error('付款失敗')
      }
    }

    const handleCheckout = async () => {
      // 如果沒有選擇付款方式，顯示警告
      const errors = [];

      if (!selectedPayMethod) errors.push('請選擇付款方式');
      if (!setShippingMethod) errors.push('請選擇運送方式');
      if (!recipient.recipientName.trim()) errors.push('請填寫收件人姓名');
      if (!recipient.phone.trim()) errors.push('請填寫收件人手機號碼');
      if (shippingMethod === '宅配' && (!selectedCity || !selectedArea || !address.trim())) {
        errors.push('請填寫收件地址');
      }
      if (shippingMethod === '超商取貨' && !store711.storename) errors.push('請選擇取貨門市');
    
      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // if (!selectedPayMethod
      // ) {
      //   alert('請選擇付款方式');
      //   return;
      // }
    
      if ( selectedPayMethod
        === '信用卡/金融卡') {
        // 選擇信用卡付款，導向綠界
        handleEcpay();
      } else if ( selectedPayMethod
        === '貨到付款') {
        // 選擇貨到付款，直接跳轉訂單完成頁面
        window.location.href = '/orderResult';
      }
    };

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
                <div className={styles.step} style={{ color: '#528F7C',textShadow: '2px 2px 4px rgba(255, 255, 255, 0.6), -2px -2px 4px rgba(0, 0, 0, 0.3)' }}>
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
          <PayMethod/>
          {/* 選擇付款方式 */}
          <div className={checkInfo.secTitle}>運送方式</div>
          <ShipMethod />
        </div>

        {/* 訂單詳情 */}
        <div className={styles.telHead}>付款詳情</div>
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

        <div ref={payFormDiv}></div>

        {/* 按鈕 */}
        <div className={styles.btn}>
          <Button1 text="返回購物車" href="/cart" />
          <Button2 text="結帳"  onClick={handleCheckout}/>
        </div>
      </div>
      <Footer/>
    </>
  )
}
