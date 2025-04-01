'use client'

import styles from '@/app/cart/cart.module.css'
import orderStyles from './orderResult.module.css'
import Button1 from '../cart/_components/button1'
import Button2 from '../cart/_components/button2'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/context/auth-context'
import { useSearchParams } from 'next/navigation'
import { isDev } from '@/config'
import { useCart } from '@/hooks/use-cart'
import "@/public/TeamB_Icon/style.css"
import {ORDER_ADD_POST} from '@/config/orders-api-path'


export default function OrderResultPage() {
  const { auth } = useAuth()

  // 從useCart解構所需的context的value屬性
  const {
    selectedItems,
    // selectedItemsCount,
    // selectedItemsTotalAmount,
    // shippingCost,
    finalTotal,
    selectedPayMethod,
    shippingMethod,
    recipient,
    selectedCity, 
    selectedArea, 
    address,
    clearAll
  } = useCart()

  // 取得網址參數，例如: ?RtnCode=xxxxxx
  const searchParams = useSearchParams()
  
  if (isDev) console.log('RtnCode', searchParams?.get('RtnCode'))
  
  // 記錄回傳的資料
  // const MerchantTradeNo = searchParams?.get('MerchantTradeNo');
  // const TradeDate = searchParams?.get('TradeDate');

  

  // const ecpayData = async () => {
  //       const store711 = JSON.parse(localStorage.getItem("store711")) || {};
  
  //       // 組合資料
  //       const orderEcpayData = {
  //         MerchantTradeNo: MerchantTradeNo,
  //         created_at: TradeDate,
  //         member_id: auth.id,
  //         total_amount: finalTotal,
  //         order_status_id: 1,
  //         shipping_method_id: shippingMethod,  
  //         payment_method_id: selectedPayMethod,
  //         order_items: selectedItems.map(item => ({
  //           item_id: item.id, // 這裡要確保 item.id 是正確的
  //           quantity: item.quantity
  //         })),
  //         recipient_name: recipient.recipientName,
  //         recipient_phone: recipient.phone,
  //         city_id: shippingMethod === 1 ? selectedCity : null, // 宅配 (1)
  //         area_id: shippingMethod === 1 ? selectedArea : null, // 宅配 
  //         detailed_address: shippingMethod === 1 ? address : "", // 宅配 
  //         store_name: store711.storename || null,  // 超商 (2)
  //         store_address: store711.storeaddress || null,  // 超商
  //       };
  
  //       try {
  //         // 儲存訂單資料到資料庫
  //         const response = await fetch(ORDER_ADD_POST, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify(orderEcpayData),
  //         });
  
  
  //         const resData = await response.json();
  //         console.log('响应数据:', resData);
  //         if (resData.success) {
  //           alert('訂單已成功提交');
  
  
  //         // 訂單提交成功後，清空購物車與訂購資訊
  //         clearAll();
  //       } else {
  //         alert('訂單提交失敗，請稍後再試');
  //       }
  //       } catch (error) {
  //         console.error('提交訂單時發生錯誤:', error);
  //         alert('提交訂單失敗');
  //       }
  //     }
    
  //     if ( selectedPayMethod
  //       === 2 ) {
  //       // 選擇信用卡付款，傳資料到資料庫
  //       ecpayData();
  //     } else if ( selectedPayMethod
  //       === 1 ) {
  //       // 選擇貨到付款，直接跳轉訂單完成頁面
  //       window.location.href = '/orderResult';
  //     }
    
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
                <div className={styles.step} style={{ color: '#6C7275' }}>
                  確認購物車清單
                </div>
              </div>
            </div>

            <div className={styles.stepper2}>
              <div className={styles.inline}>
                <div className={styles.leftDivider2}></div>
                <div className={styles.buttonIcon}>
                  <div className={styles.icon}>
                    <svg
                      className={styles.check2}
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
                <div className={styles.step} style={{ color: '#6C7275' }}>
                  填寫訂購資訊
                </div>
              </div>
            </div>

            <div className={styles.stepper2}>
              <div className={styles.inline}>
                <div className={styles.leftDivider2}></div>
                <div className={styles.buttonIcon}>
                  <div
                    className={styles.icon}
                    style={{ background: '#528F7C', border: '2px solid #528F7C' }}
                  >
                    <span className={styles.stepNumber} style={{color: '#FFF'}}>3</span>
                  </div>
                </div>
                <div className={styles.rightDivider2}></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step} style={{color:'#528F7C'}}>訂單成立</div>
              </div>
            </div>
          </div>
        </div>
        < div className={orderStyles.container}> 
            <img src="/photo/result.png" alt="" />
            <div className={orderStyles.title}>訂購完成</div>
            <div className={orderStyles.message}>感謝您的訂購，我們已收到您的訂單！</div>
            {/* <div>訂單編號:</div> */}
            <div className ={styles.btn}>
              <Button1 text="回首頁" href="/" />
              <Button2 text="查看訂單記錄" href="/auth/orderHistory" />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
