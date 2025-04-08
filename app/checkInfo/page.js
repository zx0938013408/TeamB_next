'use client'

import { useEffect, useRef, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/context/auth-context'
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
import "@/public/TeamB_Icon/style.css"
import { isDev } from '@/config'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {ORDER_ADD_POST, ORDER_LIST, API_SERVER, AVATAR_PATH} from '@/config/orders-api-path'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { COUPON_LIST, USE_COUPON } from '@/config/coupons-api-path'
import Select from 'react-select'


export default function CheckInfoPage() {
  const { auth } = useAuth()
  const MySwal = withReactContent(Swal) // 將 SweetAlert2 包裝為 React 版本


  // 從useCart解構所需的context的value屬性
  const {
    selectedItems,
    selectedItemsCount,
    selectedItemsTotalAmount,
    shippingCost,
    finalTotal,
    selectedPayMethod,
    shippingMethod,
    recipient,
    selectedCity, 
    selectedArea, 
    address,
    coupons,
    setCoupons, 
    selectedCoupon, 
    setSelectedCoupon,
    selectedCouponAmount,
    setSelectedCouponAmount,
    handleCouponChange, 
    clearAll
  } = useCart()

  // 取得未使用的優惠券
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch(`${COUPON_LIST}/${auth?.id}`);
        const data = await res.json();
        if (data.success) {
          const availableCoupons = data.coupons.filter(coupon => !coupon.is_used); // 只顯示未使用的優惠券
          console.log('可用的優惠券:', availableCoupons); // 加入這行來檢查
          setCoupons(availableCoupons);
        }
      } catch (error) {
        console.error("載入優惠券失敗：", error);
      }
    };

    if (auth?.id) {
      fetchCoupons();
    }
  }, [auth?.id]);


  // 建立ref，用來放置form表單
  const payFormDiv = useRef(null)
  

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

  // 綠界金流
  const handleEcpay = async () => {
    // 先檢查是否有選擇商品
    if (selectedItems.length === 0) {
      toast.error('請選擇商品！');
      return;
    }

      // 確保總金額有效
    if (finalTotal <= 0) {
      toast.error('金額無效');
      return;
    }

    // 產生商品名稱字串（多個商品用逗號 `,` 分隔）
    const itemsString = selectedItems
      .map((item) => `${item.product_name}x${item.quantity}`)
      .join(',')

    // 先連到node伺服器後端，取得綠界金流付款網址
    const res = await fetch(
      `${API_SERVER}/ecpay-test-only?amount=${finalTotal}&items=${itemsString}`,
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

  // 結帳按鈕觸發
  const handleCheckout = async () => {
    // 如果資料填寫不完整，顯示警告
    const errors = [];

    const store711 = JSON.parse(localStorage.getItem("store711")) || {};
    
    if (!selectedPayMethod) errors.push('請選擇付款方式');
    if (!shippingMethod) errors.push('請選擇運送方式');
    if (!recipient.recipientName.trim()) errors.push('請填寫收件人姓名');
    if (!recipient.phone.trim()) errors.push('請填寫收件人手機號碼');
    if (Number(shippingMethod) === 1 && (!selectedCity || !selectedArea )) {
      errors.push('請填寫收件地址');
    }
    if (Number(shippingMethod) === 2 && (! store711.storename || !store711.storeaddress)) errors.push('請選擇取貨門市');
  
    // SweetAlert2 警告
    if (errors.length > 0) {
      MySwal.fire({
        title: '訂購資訊不完整',
        html: errors.map(error => `<p>${error}</p>`).join(''), // 以 HTML 格式顯示錯誤
        icon: 'warning',
        confirmButtonColor: '#F7BF58',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
        },
      });
      return;
    }



    // 依付款方式跳轉頁面
    if ( selectedPayMethod
      === 2 ) {
      // 選擇信用卡付款，導向綠界
      handleEcpay();
      await handleOrderSubmission();
    } else if ( selectedPayMethod
      === 1 ) {
      // 選擇貨到付款，直接跳轉訂單完成頁面
      await handleOrderSubmission();
      window.location.href = '/orderResult'; // 跳轉到訂單結果頁
    }
  }  
    
  // 訂單送出
  const handleOrderSubmission = async () => {
    const store711 = JSON.parse(localStorage.getItem("store711")) || {};

    // 從 localStorage 取得已選的優惠券資料
    const selectedCoupon = JSON.parse(localStorage.getItem('selectedCoupon'));
    
    // 檢查是否有選擇優惠券，並且取得優惠券 ID
    const usedCouponId = selectedCoupon ? selectedCoupon.user_coupon_id : null;

    // 組合資料
    const orderData = {
      member_id: auth.id,
      total_amount: finalTotal,
      order_status_id: 1,
      shipping_method_id: shippingMethod,  
      payment_method_id: selectedPayMethod,
      order_items: selectedItems.map(item => ({
        item_id: item.product_id, // 這裡要確保 item.id 是正確的
        variant_id: Number(item.size_id),
        quantity: item.quantity,  // 商品變體 ID (這是連結到 pd_variants 的部分)
        size: item.size,
        
      })),
      recipient_name: recipient.recipientName,
      recipient_phone: recipient.phone,
      city_id: shippingMethod === 1 ? selectedCity : null, // 宅配 (1)
      area_id: shippingMethod === 1 ? selectedArea : null, // 宅配 
      detailed_address: shippingMethod === 1 ? address : "", // 宅配 
      store_name: store711.storename || null,  // 超商 (2)
      store_address: store711.storeaddress || null,  // 超商
      used_user_coupon_id : usedCouponId || null,  // 新增此行，並確保用到的優惠券 ID
    };

    try {
      
      // 儲存訂單資料到資料庫
      const response = await fetch(ORDER_ADD_POST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });


      const resData = await response.json();
      console.log("🔍 後端回傳的 resData：", resData); 
      if (resData.success) {

        const createdOrderId = resData.order_id; 

        if (createdOrderId) {
          // 確保 selectedCoupon 是物件且有 valid 欄位
          if (selectedCoupon && selectedCoupon.user_coupon_id && selectedCoupon.amount > 0) {
            const couponPayload = {
              userId: auth.id,
              couponId: selectedCoupon.user_coupon_id,
              orderId: createdOrderId,
            };
  
            console.log("✅ 傳給後端的優惠券資料：", couponPayload);
  
            // 確保優惠券資料正確，並發送到後端
            await fetch(`${USE_COUPON}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(couponPayload),
            });
          } else {
            console.log("❗️selectedCoupon 有問題，請確認優惠券資料");
          }
        } else {
          console.log("❗️createdOrderId 無效，請檢查後端返回資料");
        }
  
        console.log("selectedCoupon 是：", selectedCoupon);
        // if (selectedCoupon) {
        //   console.log("使用的優惠券資料：", {
        //     userId: auth.id,
        //     couponId: selectedCoupon.user_coupon_id,
        //     orderId: createdOrderId,
        //   });
        
        //   await fetch(`${USE_COUPON}`, {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       userId: auth.id,
        //       couponId: selectedCoupon.user_coupon_id,
        //       orderId: createdOrderId,
        //     }),
        //   });
        // }

        clearAll(); // 清空購物車與訂購資訊
       
      } else {
        // 訂單提交失敗，顯示失敗的 alert
        MySwal.fire({
          title: '訂單提交失敗',
          text: '請稍後再試，或聯繫客服。',
          icon: 'error',
          confirmButtonColor: '#F7BF58',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('提交訂單時發生錯誤:', error);
      // 若發生錯誤，顯示錯誤的 alert
      MySwal.fire({
        title: '提交訂單失敗',
        text: '發生錯誤，請檢查您的網絡連線或稍後再試。',
        icon: 'error',
        confirmButtonColor: '#F7BF58',
        confirmButtonText: 'OK',
      });
    }
  };
  
  // 優惠券 select 樣式
  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '0px', 
      borderColor: state.isFocused ? '#528F7C' : '#ccc', // 設定外框顏色
      boxShadow: state.isFocused ? '0 2px 5px rgba(82, 143, 124, 0.5)' : 'none', // 聚焦時的陰影
      '&:hover': {
        borderColor: '#528F7C', // 滑鼠懸停時的外框顏色
      },
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#528F7C', // 下拉指示器顏色
    }),
    indicatorSeparator: (base) => ({
      ...base,
      backgroundColor: '#528F7C', // 指示器分隔線顏色
    }),

    // 選擇後顯示的文字樣式
    singleValue: (base) => ({
      ...base,
      fontSize: '18px',   
      fontWeight: 'bold', 
      color: '#29755D',
      padding: '5px 10px'       
    }),
    // 下拉選單中每一個選項的樣式
    option: (base, state) => ({
      ...base,
      fontSize: '18px',
      backgroundColor: state.isFocused ? '#e6f0ec' : 'white', // hover 背景色
      color: '#333',
      cursor: 'pointer',
    }),
    placeholder: (provided) => ({
      ...provided,
      padding:'5px 10px' ,  // 設定你需要的 padding
    }),
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
                <div className={styles.step} style={{ color: '#6C7275' }}>
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
                <div className={styles.step} style={{ color: '#528F7C'}}>
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
       
        <div className={checkInfo.info}>
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
              const { id, image, product_name, size, color, price, quantity } =
                selectedItem

              return (
                <tr className={checkInfo.item} key={id}>
                  <td>
                    <img src={image ? `${AVATAR_PATH}${image}` : `${AVATAR_PATH}TeamB-logo-greenYellow.png`} alt={product_name} />
                  </td>
                  <td className={checkInfo.name}>{product_name}</td>
                  <td className={checkInfo.spec}>
                    <p>{size}</p>
                    <p>{color}</p>
                  </td>
                  <td className={checkInfo.price}>NT${price.toLocaleString()}</td>
                  <td className={checkInfo.count}>
                    <div className={checkInfo.quantityControls}>×{quantity}</div>
                   </td>
                  <td className={styles.subTotal}>
                    NT${(quantity * price).toLocaleString()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {/* 優惠券 */}
        <div>
          <Select
            instanceId="coupon-select"
            id="couponSelect"
            value={coupons
              .map(coupon => ({
                value: coupon.user_coupon_id,
                label: `NT$${coupon.amount} 折價券`,
              }))
              .find(option => option.value === selectedCoupon?.user_coupon_id) || null}
            
            onChange={handleCouponChange}  // 直接傳選中的 option 物件

            options={coupons.map(coupon => ({
              value: coupon.user_coupon_id,
              label: `NT$${coupon.amount} 折價券`,
              image: coupon.image, // 保留圖片資訊
            }))}

            // formatOptionLabel 簡化為只顯示優惠券名稱，但下拉選單顯示圖片
            formatOptionLabel={(option, { context }) => {
              if (context === 'menu') {
                // 下拉選單顯示圖片
                return (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={`${AVATAR_PATH}${option.image}`}
                      alt={option.label}
                      style={{ width: '150px', marginRight: '10px' }}
                    />
                    <span>{option.label}</span>
                  </div>
                );
              }
              // 選擇後只顯示名稱
              return <span>{option.label}</span>;
            }}

            styles={customStyles}
            placeholder="請選擇優惠券"
          />
        </div>
        
        
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
            <span>優惠券折抵:</span>
            <div className={styles.amount}>-NT${selectedCouponAmount}</div>
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
