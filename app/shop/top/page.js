"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "@/config/shop-api-path";
import styles from "../category.module.css";
import "@/public/TeamB_Icon/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteCard from "@/components/shop/InfiniteCard";
import Card from "@/components/shop/card";
import Search from "@/components/shop/Search";
import Link from "next/link";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import BannerSlider from "@/components/shop/BannerSlider";

export default function TopPage() {
  const [visibleData, setVisibleData] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("latest-desc"); //預設排序法

  // 取得商品資料
  useEffect(() => {
    fetch(`${AB_LIST}?sort=${sortOption}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ 取得資料:", data);
          setProducts(data.rows);
        }
      })
      .catch((error) => console.error("❌ API 錯誤:", error));
  }, [sortOption]);
  

  return (
    <>
      <Header />
      {/* <BannerSlider /> */}
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
              上衣
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
              {/* 視覺圖片 */}
                {/* <div className={styles.photoContainer}>
                  <img src="/photo/banner_1.png" alt="羽球標語圖" />
                </div> */}

                {/* 排序選單 */}
                <div className={styles.sortControls}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="latest-desc">最新上架</option>
                    <option value="price-asc">價格由低到高</option>
                    <option value="price-desc">價格由高到低</option>
                  </select>
                </div>

                <div className={styles.titleBg}>
                  <div className={styles.title}>上衣</div>
                </div>
                <InfiniteCard
                  items={products}
                  categoryId={1}
                  onDataChange={setVisibleData}
                />
                <div className={styles.cardContainer}>
                  {visibleData.map((item) => (
                    <div key={item.id} className={styles.cardWrapper}>
                      <Card key={item.id} item={item} linkPath="/shop/top" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
