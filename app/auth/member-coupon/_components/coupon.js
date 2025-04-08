'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import styles from '@/app/auth/member-coupon/coupon.module.css'
import { COUPON_LIST, AVATAR_PATH } from '@/config/coupons-api-path'

const Coupon = () => {
    const { auth } = useAuth()
    const [selectedTab, setSelectedTab] = useState(1) // 預設顯示「未使用」
    const [coupons, setCoupons] = useState([]) // 儲存優惠券資料
    const [couponCounts, setCouponCounts] = useState({ 1: 0, 2: 0 }) // 儲存「未使用」和「已使用」的優惠券數量

    // 設定優惠券狀態分類
    const tabs = [
        { key: 1, label: '未使用' },
        { key: 2, label: '已使用' },
    ]
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${COUPON_LIST}/${auth?.id}`);
          const data = await res.json();
    
          if (data.success) {
            const filteredCoupons = data.coupons;  // 這裡取的是返回的優惠券資料
            setCoupons(filteredCoupons);

            // 計算未使用和已使用的優惠券數量
            const counts = {
              1: filteredCoupons.filter(coupon => !coupon.is_used).length, // 未使用的優惠券數量
              2: filteredCoupons.filter(coupon => coupon.is_used).length  // 已使用的優惠券數量
            };
            setCouponCounts(counts); // 更新優惠券數量
          }
          console.log(coupons)
        } catch (error) {
          console.error("載入優惠券列表失敗：", error);
        }
      };
    
      if (auth?.id) {
        fetchData();
      }
    }, [auth?.id, selectedTab]); 

    const handleTabClick = (tabKey) => {
      setSelectedTab(tabKey);
    };

    return (
      <>
        {/* 選擇優惠券狀態 */}
        <div className={styles.tabContainer}>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                className={selectedTab === tab.key ? styles.activeTab : ''}
                onClick={() => handleTabClick(tab.key)}
              >
                {tab.label} ({couponCounts[tab.key]})
              </button>
            ))}
          </div>
        </div>

        {/* 顯示優惠券列表 */}
        <div className={styles.list}>
          <div className={styles.coupon}>
            {coupons.length > 0 ? (
              coupons
                .filter(coupon => (selectedTab === 1 ? !coupon.is_used : coupon.is_used))
                .map(coupon => (
                  <div key={coupon.user_coupon_id} className={styles.couponItem}>
                    <img src={`${AVATAR_PATH}${coupon.image}`} alt={`NT$${coupon.amount} 折價券`} />
                  </div>
                ))
            ) : (
              <div className={styles.noCoupons}>
                <img src="/photo/noCoupons.png" alt="無優惠券" />
              </div>
            )}
          </div>
        </div>
      </>
    )
};

export default Coupon;