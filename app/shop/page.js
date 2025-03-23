"use client";

import { useState, useEffect } from "react";
import styles from "./shop.module.css";
import "@/public/TeamB_Icon/style.css";
import { AB_LIST } from "@/config/shop-api-path";

import Link from "next/link";
import Carousel from "@/components/shop/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ShopPage() {
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
          {/* TODO: 麵包屑、商城bar */}
          {/* 搜尋欄 */}
          <div className={styles.search}>
            <span className={`icon-Search ${styles.iconSearch}`} />
          </div>

          {/* 上衣 top */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>上衣</div>
            </div>
            <Carousel items={products} categoryId={1} itemsPerPage={4} />
            <div className={styles.more}>
              <div>
                <Link href="../shop/top" style={{ textDecoration: "none" }}>
                  <div className={styles.textBox}>
                    <div className={styles.text}>查看更多</div>
                    <span className={`icon-Right ${styles.iconRight}`} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* 褲類 bottom */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>褲類</div>
            </div>
            <Carousel items={products} categoryId={2} itemsPerPage={4} />
            <div className={styles.more}>
              <div>
                <Link href="../shop/bottom" style={{ textDecoration: "none" }}>
                  <div className={styles.textBox}>
                    <div className={styles.text}>查看更多</div>
                    <span className={`icon-Right ${styles.iconRight}`} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* 褲類 shoes */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>鞋類</div>
            </div>
            <Carousel items={products} categoryId={3} itemsPerPage={4} />
            <div className={styles.more}>
              <div>
                <Link href="../shop/shoes" style={{ textDecoration: "none" }}>
                  <div className={styles.textBox}>
                    <div className={styles.text}>查看更多</div>
                    <span className={`icon-Right ${styles.iconRight}`} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* 運動配件 accessory */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>運動配件</div>
            </div>
            <Carousel items={products} categoryId={4} itemsPerPage={4} />
            <div className={styles.more}>
              <div>
                <Link href="../shop/accessory" style={{ textDecoration: "none" }}>
                  <div className={styles.textBox}>
                    <div className={styles.text}>查看更多</div>
                    <span className={`icon-Right ${styles.iconRight}`} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
