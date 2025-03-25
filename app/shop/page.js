"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import styles from "./shop.module.css";
import "@/public/TeamB_Icon/style.css";
import { AB_LIST } from "@/config/shop-api-path";
import Link from "next/link";
import Carousel from "@/components/shop/carousel";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/shop/FilterSideBar";
import Search from "@/components/shop/Search";
import Card from "@/components/shop/card";
import InfiniteCard from "@/components/shop/infinite-card";

export default function ShopPage() {
  // 篩選 URL參數（query）
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword")?.toLowerCase() || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 商品資料
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = keyword
          ? `${AB_LIST}?keyword=${encodeURIComponent(keyword)}`
          : AB_LIST;
        const res = await fetch(url);
        if (!res.ok) throw new Error("無法取得商品");

        const data = await res.json();
        if (data.success) {
          console.log("✅ 取得資料:", data.rows);
          setProducts(data.rows);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("❌ API 錯誤:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]); // 只要 keyword 改變，就重新請求資料

  // 卡片元件取得商品資料
  // useEffect(() => {
  //   fetch(AB_LIST)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         console.log("✅ 取得資料:", data);
  //         setProducts(data.rows);
  //       }
  //     })
  //     .catch((error) => console.error("❌ API 錯誤:", error));
  // }, []);

  return (
    <>
      <Header />

      <div className={styles.body}>
        <div className={styles.container}>
          {/* 麵包屑 */}
          {/* <nav className={styles.breadcrumb}>
              <a href="/">首頁</a>
              <span className=""> / </span>
              <span className="active" aria-current="page">
                商城
              </span>
          </nav> */}
          {/* 輪播圖 */}
          <div className={styles.imgContainer}>
            {/* <img src="/photo/activity-volleyballCourt.jpg" style={{ width: 1024 }}/> */}
          </div>
          {/* 主要區域 */}
          <div className={styles.Main}>
            {/* 篩選搜尋 sidebar */}
            <div className={styles.sideBar}>
              {/* 搜尋 */}
              <Search />

              {/* <FilterSidebar
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
              /> */}
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
