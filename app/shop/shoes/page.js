"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AB_LIST } from "@/config/shop-api-path";
import styles from "../category.module.css";
import "@/public/TeamB_Icon/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteCard from "@/components/shop/InfiniteCard";
import Card from "@/components/shop/card";
import Link from "next/link";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import FilterSideBar from "@/components/shop/FilterSideBar";

export default function TopPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [visibleData, setVisibleData] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("id-asc"); //預設排序法
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    parentCategories: [],
    subCategories: [],
    sports: [],
    themes: [],
    sizes: [],
    priceRange: { min: "", max: "" },
  });

  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [themes, setThemes] = useState([]);
  const pathname = usePathname();
  const currentCategoryName = decodeURIComponent(pathname.split("/").pop());

  useEffect(() => {
    setCategories([
      {
        id: 3,
        name: "鞋類",
        subCategories: [
          { id: 14, name: "籃球鞋" },
          { id: 15, name: "排球鞋" },
          { id: 16, name: "羽毛球鞋" },
          { id: 17, name: "休閒鞋" },
        ],
      },
    ]);

    setSports(["籃球", "排球", "羽毛球"]);
    setThemes([
      { id: 1, name: "TeamB出品" },
      { id: 2, name: "櫻色律動" },
    ]);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // 組裝 query 字串
        const queryParams = new URLSearchParams();
        // ✅ 加上排序條件
        queryParams.append("sort", sortOption);
        if (filters.keyword) queryParams.append("keyword", filters.keyword);
        if (filters.parentCategories.length)
          filters.parentCategories.forEach((id) =>
            queryParams.append("parentCategories", id)
          );
        if (filters.subCategories.length)
          filters.subCategories.forEach((id) =>
            queryParams.append("subCategories", id)
          );
        if (filters.sports.length)
          filters.sports.forEach((sport) =>
            queryParams.append("sports", sport)
          );
        if (filters.themes.length)
          filters.themes.forEach((theme) =>
            queryParams.append("themes", theme)
          );
        if (filters.sizes.length)
          filters.sizes.forEach((size) => queryParams.append("sizes", size));
        if (filters.priceRange.min)
          queryParams.append("minPrice", filters.priceRange.min);
        if (filters.priceRange.max)
          queryParams.append("maxPrice", filters.priceRange.max);

        const url = `${AB_LIST}?${queryParams.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP 錯誤");

        const data = await res.json();
        if (data.success && Array.isArray(data.rows)) {
          setProducts(data.rows);
        } else {
          setErrorMsg("查無資料");
          setProducts([]);
        }
      } catch (err) {
        setErrorMsg("資料載入失敗");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortOption]);

  useEffect(() => {
    const matched = categories.find((c) => c.name === currentCategoryName);
    if (matched && filters.parentCategories.length === 0) {
      setFilters((prev) => ({
        ...prev,
        parentCategories: [matched.id],
      }));
    }
  }, [currentCategoryName, categories]);

  // 關鍵字
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      keyword,
    }));
  }, [keyword]);

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
              鞋類
            </span>
          </nav>
          <div className={styles.Main}>
            <div className={styles.sideBar}>
              {/* 篩選 */}
              <FilterSideBar
                categories={categories}
                sports={sports}
                themes={themes}
                filters={filters}
                setFilters={setFilters}
                onClear={() =>
                  setFilters({
                    keyword: "",
                    parentCategories: [],
                    subCategories: [],
                    sports: [],
                    themes: [],
                    sizes: [],
                    priceRange: { min: "", max: "" },
                  })
                }
              />
            </div>

            <div className={styles.mainContent}>
              <div className={styles.itemSection}>
                {/* 排序選單 */}
                <div className={styles.sortControls}>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="id-asc">由舊到新</option>
                    <option value="id-desc">最新上架</option>
                    <option value="price-asc">價格由低到高</option>
                    <option value="price-desc">價格由高到低</option>
                  </select>
                </div>

                <div className={styles.titleBg}>
                  <div className={styles.title}>鞋類</div>
                </div>
                <InfiniteCard
                  items={products}
                  categoryId={3}
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
