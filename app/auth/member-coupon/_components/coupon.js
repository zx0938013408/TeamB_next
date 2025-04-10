// 'use client'

// import { useState, useEffect } from 'react'
// import { useAuth } from '@/context/auth-context'
// import styles from '@/app/auth/member-coupon/coupon.module.css'
// import { COUPON_LIST, AVATAR_PATH } from '@/config/coupons-api-path'

// const Coupon = () => {
//     const { auth } = useAuth()
//     const [selectedTab, setSelectedTab] = useState(1) // 預設顯示「未使用」
//     const [coupons, setCoupons] = useState([]) // 儲存優惠券資料
//     const [couponCounts, setCouponCounts] = useState({ 1: 0, 2: 0 }) // 儲存「未使用」和「已使用」的優惠券數量

//     // 設定優惠券狀態分類
//     const tabs = [
//         { key: 1, label: '未使用' },
//         { key: 2, label: '已使用' },
//     ]
  
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const res = await fetch(`${COUPON_LIST}/${auth?.id}`);
//           const data = await res.json();
    
//           if (data.success) {
//             const filteredCoupons = data.coupons;  // 這裡取的是返回的優惠券資料
//             setCoupons(filteredCoupons);

//             // 計算未使用和已使用的優惠券數量
//             const counts = {
//               1: filteredCoupons.filter(coupon => !coupon.is_used).length, // 未使用的優惠券數量
//               2: filteredCoupons.filter(coupon => coupon.is_used).length  // 已使用的優惠券數量
//             };
//             setCouponCounts(counts); // 更新優惠券數量
//           }
//           console.log(coupons)
//         } catch (error) {
//           console.error("載入優惠券列表失敗：", error);
//         }
//       };
    
//       if (auth?.id) {
//         fetchData();
//       }
//     }, [auth?.id, selectedTab]); 

//     const handleTabClick = (tabKey) => {
//       setSelectedTab(tabKey);
//     };

//     return (
//       <>
//         {/* 選擇優惠券狀態 */}
//         <div className={styles.tabContainer}>
//           <div className={styles.tabs}>
//             {tabs.map(tab => (
//               <button
//                 key={tab.key}
//                 className={selectedTab === tab.key ? styles.activeTab : ''}
//                 onClick={() => handleTabClick(tab.key)}
//               >
//                 {tab.label} ({couponCounts[tab.key]})
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* 顯示優惠券列表 */}
//         <div className={styles.list}>
//           <div className={styles.coupon}>
//             {coupons.length > 0 ? (
//               coupons
//                 .filter(coupon => (selectedTab === 1 ? !coupon.is_used : coupon.is_used))
//                 .map(coupon => (
//                   <div key={coupon.user_coupon_id} className={styles.couponItem}>
//                     <img src={`${AVATAR_PATH}${coupon.image}`} alt={`NT$${coupon.amount} 折價券`} />
//                   </div>
//                 ))
//             ) : (
//               <div className={styles.noCoupons}>
//                 尚未有優惠券
//               </div>
//             )}
//           </div>
//         </div>
//       </>
//     )
// };

// export default Coupon;

'use client'

import {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { useAuth } from '@/context/auth-context'
import styles from '@/app/auth/member-coupon/coupon.module.css'
import { COUPON_LIST, AVATAR_PATH } from '@/config/coupons-api-path'

const Coupon = forwardRef((props, ref) => {
  const { auth } = useAuth()
  const [selectedTab, setSelectedTab] = useState(1)
  const [coupons, setCoupons] = useState([])
  const [couponCounts, setCouponCounts] = useState({ 1: 0, 2: 0 })

  const fetchData = async () => {
    try {
      const res = await fetch(`${COUPON_LIST}/${auth?.id}`);
      const data = await res.json();
  
      if (data.success) {
        const filteredCoupons = data.coupons;
  
        // 根據 created_at 排序，從新到舊
        const sortedCoupons = filteredCoupons.sort((a, b) => {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA; // 這樣會實現從新到舊的排序
        });
  
        setCoupons(sortedCoupons);
  
        // 更新未使用和已使用優惠券的數量
        const counts = {
          1: sortedCoupons.filter((c) => !c.is_used).length,
          2: sortedCoupons.filter((c) => c.is_used).length,
        };
        setCouponCounts(counts);
      }
    } catch (error) {
      console.error('載入優惠券列表失敗：', error);
    }
  };
  useEffect(() => {
    if (auth?.id) {
      fetchData()
    }
  }, [auth?.id])

  // 讓外部可以手動觸發 fetchData()
  useImperativeHandle(ref, () => ({
    reloadCoupons: fetchData,
  }))

  const handleTabClick = (tabKey) => {
    setSelectedTab(tabKey)
  }

  return (
    <>
      <div className={styles.tabContainer}>
        <div className={styles.tabs}>
          {[{ key: 1, label: '未使用' }, { key: 2, label: '已使用' }].map(
            (tab) => (
              <button
                key={tab.key}
                className={selectedTab === tab.key ? styles.activeTab : ''}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label} ({couponCounts[tab.key]})
              </button>
            )
          )}
        </div>
      </div>

      <div className={styles.list}>
        <div className={styles.coupon}>
          {coupons.length > 0 ? (
            coupons
              .filter((coupon) =>
                selectedTab === 1 ? !coupon.is_used : coupon.is_used
              )
              .map((coupon) => (
                <div
                  key={coupon.user_coupon_id}
                  className={styles.couponItem}
                >
                  <img
                    src={`${AVATAR_PATH}${coupon.image}`}
                    alt={`NT$${coupon.amount} 折價券`}
                  />
                </div>
              ))
          ) : (
            <div className={styles.noCoupons}>尚未有優惠券</div>
          )}
        </div>
      </div>
    </>
  )
})

// ✅ 修正 eslint 警告：幫 forwardRef 組件加 displayName
Coupon.displayName = 'Coupon'

export default Coupon