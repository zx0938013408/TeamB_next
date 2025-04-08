"use client";

import { useState, useEffect } from "react";
import { useRef } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./shop.module.css";
import "@/public/TeamB_Icon/style.css";
import { AB_LIST } from "@/config/shop-api-path";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSideBar from "@/components/shop/FilterSideBar";
import InfiniteCard from "@/components/shop/InfiniteCard";
import Card from "@/components/shop/card";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import BannerSlider from "@/components/shop/BannerSlider";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const cardRef = useRef(null);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [sortOption, setSortOption] = useState("id-asc"); //預設排序法
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] = useState({
    keyword: "",
    parentCategories: [], // 主分類 id
    subCategories: [], // 子分類 id
    sports: [],
    themes: [],
    sizes: [],
    priceRange: { min: "", max: "" },
  });

  const [categories, setCategories] = useState([]);
  const [themes, setThemes] = useState([]);
  const [sports, setSports] = useState([]);

  const handleSearchDone = () => {
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  

  // 關鍵字
  useEffect(() => {
    const kw = searchParams.get("keyword")?.toLowerCase() || "";
    setKeyword(kw);
  }, [searchParams]);

  // 取得商品資料
  useEffect(() => {
    fetch(AB_LIST)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          console.log("✅ 取得資料:", data);
          setAllProducts(data.rows);
        }
      })
      .catch((error) => console.error("❌ API 錯誤:", error));
  }, []);

  // 篩選checkbox
  useEffect(() => {
    setCategories([
      {
        id: 1,
        name: "上衣",
        subCategories: [
          { id: 5, name: "短袖" },
          { id: 6, name: "長袖" },
        ],
      },
      {
        id: 2,
        name: "褲子",
        subCategories: [
          { id: 7, name: "短褲" },
          { id: 8, name: "長褲" },
        ],
      },
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
      {
        id: 4,
        name: "運動裝備",
        subCategories: [
          { id: 9, name: "後背包" },
          { id: 10, name: "腰包" },
          { id: 11, name: "水壺" },
          { id: 12, name: "運動手套" },
          { id: 13, name: "護膝" },
        ],
      },
    ]);

    setSports(["籃球", "排球", "羽球"]);

    setThemes([
      { id: 1, name: "TeamB出品" },
      { id: 2, name: "櫻色律動" },
    ]);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setErrorMsg(""); // 清除舊錯誤
      console.log("🔄 current filters:", filters);

      try {
        // 組裝 query 字串
        const queryParams = new URLSearchParams();
        // ✅ 加上排序條件
        queryParams.append("sort", sortOption);
        // 關鍵字
        if (keyword) queryParams.append("keyword", keyword);
        // 加入篩選條件
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
        console.log("🔍 請求 API:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("無法取得商品（HTTP 錯誤）");

        let data;
        try {
          data = await res.json();
        } catch (jsonError) {
          console.error("❌ JSON 解析失敗：", jsonError);
          setErrorMsg("伺服器回傳格式錯誤，請稍後再試 🥲");
          setProducts([]);
          return;
        }

        if (data.success && Array.isArray(data.rows)) {
          console.log("✅ 取得資料:", data.rows);
          setProducts(data.rows);
        } else {
          console.warn("⚠️ API 回傳結構異常:", data);
          setErrorMsg("資料格式錯誤或查無結果 🧐");
          setProducts([]);
        }
      } catch (fetchError) {
        console.error("❌ API 請求失敗:", fetchError);
        setErrorMsg("商品資料載入失敗，請檢查網路或稍後再試 😢");
        setProducts([]);
      } finally {
        setLoading(false);
      }
      console.log("🔍 keyword:", keyword);
    };
    fetchProducts();
    console.log("🟢 目前 filters 狀態：", filters);
  }, [keyword, filters, sortOption]);

  // console.log("滑桿 value：", filters.priceRange);

  return (
    <>
      <Header />

      <div className={styles.body}>
        {/* 輪播圖 */}
        <BannerSlider />
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

          <div className={styles.imgContainer}></div>
          {/* 主要區域 */}
          <div className={styles.Main}>
            {/* 篩選搜尋 sidebar */}
            <div className={styles.sideBar}>
              {errorMsg && <div className="text-red-500">{errorMsg}</div>}
              <FilterSideBar
              onSearchDone={handleSearchDone}
                categories={categories}
                // pdTypes={pdTypes}
                themes={themes}
                sports={sports}
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

            <div className={styles.mainContent} ref={cardRef}>
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
              
              <InfiniteCard items={products} onDataChange={setVisibleData} key={JSON.stringify(filters)}/>
              {visibleData.length === 0 ? (
                <p className="text-gray-500">沒有找到符合條件的商品喔～</p>
              ) : (
                <div className={styles.cardContainer}>
                  {visibleData.map((item) => (
                    <Card key={item.id} item={item} />
                  ))}
                </div>
              )}

              {errorMsg && (
                <div className="text-red-500 text-sm my-2">{errorMsg}</div>
              )}
              {loading && (
                <div className="text-gray-500 text-sm my-2">
                  商品資料載入中...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollToTopButton />
    </>
  );
}
