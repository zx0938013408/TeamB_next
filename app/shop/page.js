"use client";

import { useState, useEffect } from "react";
import styles from "./shop.module.css";
import "@/public/TeamB_Icon/style.css";
import { AB_LIST } from "@/config/shop-api-path";

import Link from "next/link";
import Carousel from "@/components/shop/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import FilterSidebar from "@/components/shop/FilterSideBar";

export default function ShopPage() {
  const [products, setProducts] = useState([]); // 存放商品資料
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  // 🚀 根據篩選條件向 `/AB_LIST` 請求資料
  useEffect(() => {
    const fetchProducts = async () => {
      let query = new URLSearchParams(filters).toString(); // 轉換成 URL 查詢字串
      const res = await fetch(`/AB_LIST?${query}`);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, [filters]); // 只要 filters 變更，就重新 fetch 資料

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
          <nav className={styles.breadcrumb}>
              <a href="/">首頁</a>
              <span className=""> / </span>
              <span className="active" aria-current="page">
                商城
              </span>
          </nav>
          {/* 主要區域 */}
          <div className={styles.Main}>
            {/* 篩選搜尋 sidebar */}
            <div className={styles.sideBar}>
            {/* 搜尋 */}
              <div className={styles.search}>
              <input
                type="text"
                placeholder="search"
                onChange={(e) => handleSearch(e.target.value)}
                className={styles.input}
              />
                <span className={`icon-Search ${styles.iconSearch}`} />
              </div>
              <div className="shop-container">
                {/* 篩選列 */}
                <div>
                  <select
                    id="people"
                    name="people"
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="date">依照活動日期排序</option>
                    <option value="location">依照地區排序</option>
                    <option value="price">依照費用排序</option>
                    <option value="people">依照報名人數排序</option>
                  </select>
                </div>
                <FilterSidebar onChange={setFilters} />
              </div>
            </div>
            <div className={styles.mainContent}>
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
                    <Link
                      href="../shop/bottom"
                      style={{ textDecoration: "none" }}
                    >
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
                    <Link
                      href="../shop/shoes"
                      style={{ textDecoration: "none" }}
                    >
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
                    <Link
                      href="../shop/accessory"
                      style={{ textDecoration: "none" }}
                    >
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
        </div>
      </div>

      <Footer />
    </>
  );
}
