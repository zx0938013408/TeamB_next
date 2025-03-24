"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "@/config/shop-api-path";
import styles from "../category.module.css";
import "@/public/TeamB_Icon/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteCard from "@/components/shop/infinite-card";

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
          {/* 搜尋欄 */}
          <div className={styles.search}>
            <span className={`icon-Search ${styles.iconSearch}`} />
          </div>
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>鞋類</div>
            </div>
            <InfiniteCard items={products} categoryId={3} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
