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
import FilterSideBar from "@/components/shop/FilterSideBar";
import Search from "@/components/shop/Search";
import InfiniteCard from "@/components/shop/infinite-card";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function ShopPage() {
  // 篩選 URL參數（query）
  const searchParams = useSearchParams();
  // const keyword = searchParams.get("keyword")?.toLowerCase() || "";
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    sports: [],
    apparel: [],
    priceRange: { min: "0", max: "5000" },
  });
  const [categories, setCategories] = useState([]);
  const [pdTypes, setPdTypes] = useState([]);

  useEffect(() => {
    const kw = searchParams.get("keyword")?.toLowerCase() || "";
    setKeyword(kw);
  }, [searchParams]);

  // 監聽 關鍵字、篩選 取得資料
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${AB_LIST}`);
        const data = await res.json();
        console.log("API 回傳的分類資料:", data); // 確認資料格式 是物件

        if (data.success && Array.isArray(data.rows)) {
          // ✅ 整理主分類
          const categories = [
            ...new Set(
              data.rows.map((item) => item.categories_name).filter(Boolean)
            ),
          ];

          // ✅ 整理子分類
          const pdTypes = [
            ...new Set(data.rows.map((item) => item.pd_type).filter(Boolean)),
          ];

          console.log("主分類:", categories);
          console.log("子分類:", pdTypes);

          // ✅ 存進狀態（如果你有 setPdTypes 的話）
          setCategories(categories);
          setPdTypes(pdTypes);
        } else {
          console.error("❌ 資料格式錯誤:", data);
        }
      } catch (error) {
        console.error("❌ 分類加載失敗:", error);
      }
    };

    const fetchProducts = async () => {
      setLoading(true);
      console.log("🔄 current filters:", filters);
      try {
        const queryParams = new URLSearchParams();

        if (keyword) queryParams.append("keyword", keyword);
        // 加入篩選條件
        filters.sports.forEach((sport) =>
          queryParams.append("sports[]", sport)
        );
        filters.apparel.forEach((apparel) =>
          queryParams.append("apparel[]", apparel)
        );

        if (filters.category) {
          queryParams.append("category", filters.category);
        }

        const url = `${AB_LIST}?${queryParams.toString()}`;
        console.log("🔍 請求 API:", url);

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
      console.log("🔍 keyword:", keyword);
    };

    fetchProducts();
    if (categories.length === 0) {
      fetchCategories(); // 🔄 只在第一次載入時取得分類
    }
  }, [keyword, filters]); // ✅ 監聽 filters，當篩選條件變動時，重新請求

  console.log("滑桿 value：", filters.priceRange);

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
            <span className={styles.active} aria-current="page">
              商城
            </span>
          </nav>
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

              <FilterSideBar
                categories={categories}
                pdTypes={pdTypes}
                themes={["櫻花主題", "春季限定", "聯名系列"]}
                filters={filters}
                setFilters={setFilters}
                selectedCategory={filters.category}
                selectedPdTypes={filters.apparel}
                selectedThemes={filters.themes}
                onCategorySelect={(category) => {
                  setFilters((prev) => ({ ...prev, category }));
                }}
                onPdTypeToggle={(type, checked) => {
                  const updated = checked
                    ? [...filters.apparel, type]
                    : filters.apparel.filter((t) => t !== type);
                  setFilters((prev) => ({ ...prev, apparel: updated }));
                }}
                onThemeToggle={(theme, checked) => {
                  const next = checked
                    ? [...(filters.themes || []), theme]
                    : filters.themes.filter((t) => t !== theme);
                  setFilters((f) => ({ ...f, themes: next }));
                }}
                onClear={() =>
                  setFilters({
                    category: "",
                    apparel: [],
                    sports: [],
                    priceRange: { min: "", max: "" },
                  })
                }
              />

              {/* 排序列 */}
              {/* <div>
        <select
          id="sort-bar"
          name="sort-bar"
          onChange={(e) => onFilterChange("sort", e.target.value)}
        >
          <option value="date">最新上架</option>
          <option value="location">價錢由高至低</option>
          <option value="price">價前由低至高</option>
        </select>
      </div> */}

              {/* 連結列 */}
              {/* <div>
        <div className={styles.title}>精選主題</div>
        <Link href="../shop/top" style={{ textDecoration: "none" }}>
          <div className={styles.text}>TeamB</div>
        </Link>
        <Link href="../shop/bottom" style={{ textDecoration: "none" }}>
          <div className={styles.text}>GymFlex</div>
        </Link>
        <Link href="../shop/bottom" style={{ textDecoration: "none" }}>
          <div className={styles.text}>Sweet Blossom</div>
        </Link>
      </div> */}
            </div>

            <div className={styles.mainContent}>
              {/* 上衣 top */}
              {/* <div className={styles.itemsSection}>
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
              </div> */}
              {/* 褲類 bottom */}
              {/* <div className={styles.itemsSection}>
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
              </div> */}
              {/* 褲類 shoes */}
              {/* <div className={styles.itemsSection}>
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
              </div> */}
              {/* 運動配件 accessory */}
              {/* <div className={styles.itemsSection}>
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
              </div> */}
              <InfiniteCard items={products} categoryId={null} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTopButton/>
    </>
  );
}
