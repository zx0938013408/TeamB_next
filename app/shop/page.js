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

export default function ShopPage() {
  // 篩選 URL參數（query）
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // 取得 URL 查詢參數
  const getQueryParams = () => {
    return {
      sports: searchParams.get("sports")
        ? searchParams.get("sports").split(",")
        : [],
      apparel: searchParams.get("apparel")
        ? searchParams.get("apparel").split(",")
        : [],
      priceRange: {
        min: searchParams.get("minPrice") || "",
        max: searchParams.get("maxPrice") || "",
      },
    };
  };

  // 商品資料
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(getQueryParams());

  // 更新 URL
  const updateURL = (newFilters) => {
    const params = new URLSearchParams();

    if (newFilters.sports?.length)
      params.set("sports", newFilters.sports.join(","));
    if (newFilters.apparel?.length)
      params.set("apparel", newFilters.apparel.join(","));
    if (newFilters.priceRange.min)
      params.set("minPrice", newFilters.priceRange.min);
    if (newFilters.priceRange.max)
      params.set("maxPrice", newFilters.priceRange.max);

    router.push(`${pathname}?${params.toString()}`);
  };

  // 取得商品資料
  const fetchProducts = async () => {
    const params = new URLSearchParams();
    if (filters.sports.length) params.set("sports", filters.sports.join(","));
    if (filters.apparel.length)
      params.set("apparel", filters.apparel.join(","));
    if (filters.priceRange.min) params.set("minPrice", filters.priceRange.min);
    if (filters.priceRange.max) params.set("maxPrice", filters.priceRange.max);

    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data);
  };

  // 當篩選條件改變時重新請求 API
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  // 卡片元件取得商品資料
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
              <div className={styles.search}>
                <input
                  type="text"
                  placeholder="search"
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleSearch(e.target.value)
                  }
                  className={styles.input}
                />
                <span
                  className={`icon-Search ${styles.iconSearch}`}
                  onClick={() =>
                    handleSearch(
                      document.querySelector(`.${styles.input}`).value
                    )
                  }
                  style={{ cursor: "pointer" }}
                />
              </div>

              <FilterSidebar
                filters={filters}
                onFilterChange={(newFilters) => {
                  setFilters(newFilters);
                  updateURL(newFilters);
                }}
              />
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
