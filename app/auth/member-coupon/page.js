"use client";
import "../../../styles/globals.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "../../../styles/auth/member.module.css";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import couponStyles from "./coupon.module.css";
import Coupon from "./_components/coupon";
import ScratchBtn from "@/app/test/page"; 

const MemberCoupon = () => {
  const { auth, logout } = useAuth();
  const [user, setUser] = useState(null);
  const router = useRouter();
  const couponRef = useRef(); // 用來操作 Coupon 的方法

  useEffect(() => {
    if (auth?.id) {
      setUser(auth);
    }
  }, [auth]);

  if (!user) return <p>載入中...</p>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* 側邊欄 */}
        <div className={styles.sidebar}>
          <Link href="/auth/member" className={styles.menuItem}>會員中心</Link>
          <Link href="/auth/member-edit" className={styles.menuItem}>編輯個人檔案</Link>
          <Link href="/auth/member-account" className={styles.menuItem}>帳號管理</Link>
          <Link href="/auth/orderHistory" className={styles.menuItem}>我的訂單</Link>
          <Link href="/auth/member-likes" className={styles.menuItem}>收藏商品</Link>
          <Link href="/auth/member-coupon" className={styles.menuItem}>我的優惠券</Link>
          <button
            className={styles.menuItemBtn}
            onClick={() => {
              logout();
              toast("會員已登出", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
              router.push("/");
            }}
          >
            登出
          </button>
        </div>

        {/* 右側內容 */}
        <div className={couponStyles.content}>
          <div className={couponStyles.orderName}>我的優惠券</div>
          <div className={couponStyles.tabContent}>
            {/* 傳入刮完卡要更新優惠券的事件 */}
            <ScratchBtn onPrizeClaimed={() => couponRef.current?.reloadCoupons()} />
            {/*  給 Coupon 元件加 ref */}
            <Coupon ref={couponRef} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberCoupon;