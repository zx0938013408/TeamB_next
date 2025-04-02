"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "@/config/shop-api-path";
import styles from "../category.module.css";
import "@/public/TeamB_Icon/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteCard from "@/components/shop/infinite-card";
import Search from "@/components/shop/Search";
import Link from "next/link";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function TopPage() {
  const [products, setProducts] = useState([]);

  // 取得商品資料
  useEffect(() => {
    fetch(AB_LIST)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ 取得資料:", data);
          setProducts(data.rows);
        }
      })
      .catch((error) => console.error("❌ API 錯誤:", error));
  }, []);

  return (
    <>
      <Header />
      <div className={styles.body}>
        <div className={styles.container}>
          {/* 麵包屑 */}
          <nav className={styles.breadcrumb} aria-label="breadcrumb">
            <Link href="/" className={styles.link}>
              首頁
            </Link>
            <span className={styles.separator}>/</span>

            <Link href="/shop" className={styles.link}>
              商城
            </Link>
            <span className={styles.separator}>/</span>

            <span className={styles.active} aria-current="page">
              鞋類
            </span>
          </nav>
          <div className={styles.Main}>
            <div className={styles.sideBar}>
              {/* 搜尋 */}
              <Search />
              {/* 左側篩選 */}
              {/* TODO */}
            </div>
            <div className={styles.mainContent}>
              <div className={styles.itemSection}>
                <div className={styles.titleBg}>
                  <div className={styles.title}>鞋類</div>
                </div>
                <InfiniteCard items={products} categoryId={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton/>
    </>
  );
}
