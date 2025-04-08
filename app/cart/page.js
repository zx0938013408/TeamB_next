'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/context/auth-context'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import styles from './cart.module.css'
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa'
import TableHeader from './_components/TableHeader'
import Button1 from './_components/button1'
import Button2 from './_components/button2'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { AVATAR_PATH, AB_LIST } from '@/config/shop-api-path'
import Carousel from '@/components/shop/carousel'
import Link from 'next/link'
import shopStyles from '@/app/shop/[pd_id]/product-detail.module.css'
import "@/public/TeamB_Icon/style.css"


export default function CartPage() {
  const { auth } = useAuth()
  const [recommendedItems, setRecommendedItems] = useState([]); // ✅ 確保 hooks 不變

  // 從useCart解構所需的context的value屬性
  const {
    onDecrease,
    onIncrease,
    onRemove,
    cartItems,
    selectedItems,
    onToggleChecked,
    onCheckedAll,
    selectedItemsCount,
    selectedItemsTotalAmount,
    setSelectedItems,
  } = useCart()

  // 處理數量增加或減少時對選取商品數量和狀態的影響
  const handleQuantityChange = (cartItem, operation) => {
    const nextCount =
      operation === 'increase' ? cartItem.quantity + 1 : cartItem.quantity - 1

    if (nextCount <= 0) {
      notifyAndRemove(cartItem.name, cartItem.id) // 若數量為 0 刪除商品
    } else {
      if (selectedItems.some((item) => item.id === cartItem.id)) {
        // 當商品已選中時，更新選擇商品的數量
        setSelectedItems((prev) =>
          prev.map((item) =>
            item.id === cartItem.id ? { ...item, quantity: nextCount } : item
          )
        )
      }
      operation === 'increase'
        ? onIncrease(cartItem.id)
        : onDecrease(cartItem.id) // 進行數量增減
    }
  }

  const notifyAndRemove = (cartItemName, cartItemId) => {
    // 轉換為react包裝用的swal
    const MySwal = withReactContent(Swal)

    MySwal.fire({
      title: '你確定要刪除嗎?',
      text: '這個動作將無法復原!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F7BF58',
      cancelButtonColor: '#29755D',
      confirmButtonText: '是的，我要刪除!',
      cancelButtonText: '取消',
      reverseButtons: true,
      backdrop: true, // 讓 SweetAlert2 自己管理滾動條
    }).then((result) => {
      // 按下確定刪除按鈕
      if (result.isConfirmed) {
        MySwal.fire({
          title: '已成功刪除!',
          text: `${cartItemName} 已從購物車中刪除!`,
          icon: 'success',
          confirmButtonColor: '#F7BF58',
        })

        // 刪除功能
        onRemove(cartItemId)
      }
    })
  }

  const handleConfirmClick = () => {
    // 檢查是否有選擇商品
    if (selectedItems.length === 0) {
      const MySwal = withReactContent(Swal) // 將 SweetAlert2 包裝為 React 版本
      
      
      MySwal.fire({
        title: '請選擇商品！',
        text: '您必須選擇至少一項商品才能繼續。',
        icon: 'warning',
        confirmButtonColor: '#F7BF58', // 設置確認按鈕顏色
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          content: 'custom-content',
          confirmButton: 'custom-confirm-button',
        },
        
      })
    } else {
      // 如果有選擇商品，跳轉到 checkInfo 頁面
      window.location.href = '/checkInfo'
    }
  }

    // 取得隨機推薦商品資料
    useEffect(() => {
      const fetchRecommendedItems = async () => {
        try {
          const apiUrl = `${AB_LIST}`;
          console.log("正在請求推薦商品:", apiUrl);
  
          const res = await fetch(apiUrl);
          console.log("API 響應狀態:", res.status); // 檢查狀態碼
  
          if (!res.ok) {
            throw new Error(`API 請求失敗，狀態碼: ${res.status}`);
          }
  
          const data = await res.json();
          console.log("API 回應資料:", data); // 檢查返回資料
  
          if (data.success && data.rows) {
            const randomItems = [...data.rows]
              .sort(() => Math.random() - 0.5) // 隨機排序
              .slice(0, 8); // 取前 8 個
            setRecommendedItems(randomItems); // 📌 設定推薦商品
          } else {
            console.error("❌ 無法獲取推薦商品", data.error);
          }
        } catch (error) {
          console.error("❌ fetch 錯誤:", error);
        }
      };
  
      fetchRecommendedItems();
    }, []); // 🚀 只在頁面載入時執行一次

  return (
    <>
      {/* <Link href="/product">商品列表</Link> */}
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
                  <div
                    className={styles.icon}
                    style={{
                      background: ' #528F7C',
                      border: '2px solid #528F7C',
                    }}
                  >
                    <span className={styles.stepNumber} style={{ color: '#FFF' }}>
                      1
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
                  確認購物車清單
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
                    style={{ background: '#ffffff', border: '2px solid #6C7275' }}
                  >
                    <span className={styles.stepNumber}>2</span>
                  </div>
                </div>
                <div
                  className={styles.rightDivider}
                  style={{ background: '#6C7275' }}
                ></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step}>填寫訂購資訊</div>
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
                    style={{ background: '#ffffff', border: '2px solid #6C7275' }}
                  >
                    <span className={styles.stepNumber}>3</span>
                  </div>
                </div>
                <div className={styles.rightDivider2}></div>
              </div>
              <div className={styles.verticalTitle}>
                <div className={styles.step}>訂單成立</div>
              </div>
            </div>
          </div>
        </div>
        {/* 檢查購物車是否為空 */}
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <img src="/photo/noCart.png" alt="" />
            <span>您的購物車沒有商品</span>
            <Button1 text="來去逛逛" href="/shop" />
          </div>
        ) : (
          <>
          <div className={styles.telHead}>購物車清單</div>
            <table title="購物車">
              <TableHeader />
              
              <tbody>
                {cartItems.map((cartItem) => {
                  const { id, image, product_name, size,color, price, quantity } = cartItem

                  const isChecked = selectedItems.some((item) => item.id === id) // 判斷該商品是否被選擇

                  return (
                    <tr className={styles.item} key={id}>
                      <td className={styles.checked}>
                        <input
                          type="checkbox"
                          checked={isChecked} // 使用 isChecked 來決定是否勾選
                          onChange={() => onToggleChecked(cartItem)} // 傳入整個商品物件
                        />
                      </td>
                      <td>
                        <img src={image ? `${AVATAR_PATH}${image}` : `${AVATAR_PATH}TeamB-logo-greenYellow.png`} alt={product_name} />
                      </td>

                      <td className={styles.name}>{product_name}</td>
                      <td className={styles.spec}>
                        <p>{size}</p>
                        <p>{color}</p>
                      </td>
                      <td className={styles.price}>
                        NT${price.toLocaleString()}
                      </td>
                      <td className={styles.count}>
                        <div className={styles.quantityControls}>
                          <button
                            className={styles.minus}
                            onClick={() =>
                              handleQuantityChange(cartItem, 'decrease')
                            }
                          >
                            <FaMinus />
                          </button>

                          <input
                            className={styles.input}
                            type="text"
                            value={quantity}
                            readOnly
                          />
                          <button
                            className={styles.plus}
                            onClick={() =>
                              handleQuantityChange(cartItem, 'increase')
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </td>

                      <td className={styles.subTotal}>
                        NT${(quantity * price).toLocaleString()}
                      </td>

                      <td>
                        <button
                          className={styles.remove}
                          onClick={() => notifyAndRemove(product_name, id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className={styles.total}>
              <div>
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={onCheckedAll}
                />
                &nbsp;&nbsp;全選
              </div>

              <div>
                總數量:{' '}
                <div className={styles.amount}>{selectedItemsCount}</div>個
                &nbsp;/&nbsp;商品總金額:
                <div className={styles.amount}>
                  NT$
                  {selectedItemsTotalAmount.toLocaleString()}
                </div>
              </div>
            </div>
            <div className={styles.btn}>
              <Button2
                text="確認"
               
                onClick={handleConfirmClick}
              />
            </div>
          </>
        )}
        {/* 大家還看了 */}
        <div className={styles.shopSection}>
          <div className={shopStyles.itemsSection}>
            <div className={shopStyles.titleBg}>
              <div className={shopStyles.title}>大家還看了</div>
            </div>
            {recommendedItems.length > 0 ? (
              <Carousel items={recommendedItems} categoryId={null} />
            ) : (
              <p className={shopStyles.loading}>推薦商品載入中...</p>
            )}

            <div className={shopStyles.more}>
              <Link href="/shop" style={{ textDecoration: "none" }}>
                <div className={shopStyles.textBox}>
                  <div className={shopStyles.text}>查看更多</div>
                  <span className={`icon-Right ${shopStyles.iconRight}`} />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}
