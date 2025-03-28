"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation"; // 使用 next/navigation 的 useParams
import { AB_ITEM_GET, AVATAR_PATH, AB_LIST } from "@/config/shop-api-path";
import styles from "./product-detail.module.css";
import "../../../public/TeamB_Icon/style.css";
import Carousel from "../../../components/shop/carousel";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LikeHeart from "@/components/like-hearts";
import Search from "@/components/shop/Search";
import { useCart } from "@/hooks/use-cart";
import { ToastContainer, toast } from "react-toastify";

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]); // ✅ 確保 hooks 不變
  const params = useParams();
  const pd_id = params.pd_id;
  const {onAdd} = useCart()

  // 引用 select 元素
  const sizeRef = useRef(null);
  const quantityRef = useRef(null);

  // toast
  const notify = (name)=>{
    toast.success(`${name} 成功加入購物車!`)
  }

  // 取得個別動態路由的資料
  useEffect(() => {
    if (!pd_id) return;
    console.log("📦 API 回傳的 product:", product);
    const apiUrl = `${AB_ITEM_GET}/${pd_id}`;
    console.log(`📢 正在請求 API: ${apiUrl}`);
    fetch(apiUrl)
      .then(async (res) => {
        console.log(`✅ API 響應狀態: ${res.status}`);
        const responseText = await res.text();
        console.log("📄 API 回應內容:", responseText);
        try {
          return JSON.parse(responseText);
        } catch (error) {
          throw new Error("❌ API 回應的不是 JSON，可能是錯誤頁面");
        }
      })
      .then((data) => {
        console.log("📦 API 回傳資料:", data);
        if (data.success) {
          setProduct(data.data);
        } else {
          console.error("❌ API 內部錯誤:", data.error);
        }
      })
      .catch((error) => console.error("❌ fetch 錯誤:", error));
  }, [pd_id]); // 依賴 pd_id

  // 取得隨機推薦商品資料
  useEffect(() => {
    const fetchRecommendedItems = async () => {
      try {
        const apiUrl = `${AB_LIST}`;
        console.log("正在請求推薦商品:", apiUrl);

        const res = await fetch(apiUrl);
        console.log("API 響應狀態:", res.status); // 檢查狀態碼

        if (!res.ok) {
          throw new Error(`API 請求失敗，狀態碼: ${res.status}`);
        }

        const data = await res.json();
        console.log("API 回應資料:", data); // 檢查返回資料

        if (data.success && data.rows) {
          const randomItems = [...data.rows]
            .sort(() => Math.random() - 0.5) // 隨機排序
            .slice(0, 8); // 取前 8 個
          setRecommendedItems(randomItems); // 📌 設定推薦商品
        } else {
          console.error("❌ 無法獲取推薦商品", data.error);
        }
      } catch (error) {
        console.error("❌ fetch 錯誤:", error);
      }
    };

    fetchRecommendedItems();
  }, []); // 🚀 只在頁面載入時執行一次

  if (!product) {
    return <p className={styles.loading}>載入中...</p>;
  }

  const handleAddToCart = () => {
    const selectedSize = sizeRef.current?.value;
    const selectedQuantity = quantityRef.current?.value;

    if (selectedSize === "尺寸" || selectedQuantity === "數量") {
      toast.error("請選擇尺寸和數量");
      return;
    }

    // 這裡把選擇的尺寸和數量傳遞給 onAdd
    onAdd({
      id: product.id,
      name: product.product_name,
      price: product.price,
      size: selectedSize,
      quantity: selectedQuantity,
      image: product.image,
    });
    notify(product.product_name);
  };

  return (
    <>
      <Header />
      <div className={styles.body}>
        <div className={styles.container}>
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
              {/* 商品詳情展示區 */}
              <div className={styles.aContainer}>
                <div className={styles.leftSection}>
                  {/* 商品大圖 */}
                  <div className={styles.mainImage}>
                    <img
                      src={`${AVATAR_PATH}/${product.image}`}
                      alt={product.product_name}
                    />
                  </div>
                  {/* 商品小圖 */}
                  <div className={styles.thumbnailImages}>
                    <img
                      src={`${AVATAR_PATH}/${product.image}`}
                      alt={product.product_name}
                    />
                    <img
                      src={`${AVATAR_PATH}/${product.image}`}
                      alt={product.product_name}
                    />
                    <img
                      src={`${AVATAR_PATH}/${product.image}`}
                      alt={product.product_name}
                    />
                  </div>
                </div>
                <div className={styles.rightSection}>
                  <div className={styles.productInfo}>
                    <div className={styles.productNameSection}>
                      <div className={styles.topColumn}>
                        <div className={styles.category}>
                          {product.categories_name}
                        </div>
                        <LikeHeart />
                      </div>
                      <div className={styles.productName}>
                        {product.product_name} {product.color}
                      </div>
                    </div>
                    <div>
                      <span className={styles.detailPrice}>NT$</span>
                      <span className={styles.detailPrice}>
                        {product.price}
                      </span>
                    </div>
                  </div>
                  <div className={styles.productDetail}>
                    <select className={styles.sizeSection}>
                      <option className={styles.dropdown}>尺寸</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                    </select>
                    <div className={styles.quantity}>
                      <select className={styles.quantitySection}>
                        <option className={styles.dropdown}>數量</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <div className={styles.inventory}>
                        庫存：{product.inventory} 件
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btnPrimary} onClick={handleAddToCart}>加入購物車</button>
                      <button className={styles.btnSecondary}>立即購買</button>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer/>

              {/* 商品詳情 */}
              <div className={styles.bContainer}>
                <div className={styles.title}>商品詳情</div>
                <div
                  className={styles.bDetailSection}
                  style={{
                    backgroundImage: `url(${AVATAR_PATH}/${encodeURIComponent(
                      product.image
                    )})`,
                  }}
                >
                  <div className={styles.description}>
                    {product.product_description}
                  </div>
                </div>
              </div>

              {/* 大家還看了 */}
              <div className={styles.itemsSection}>
                <div className={styles.titleBg}>
                  <div className={styles.title}>大家還看了</div>
                </div>
                {recommendedItems.length > 0 ? (
                  <Carousel items={recommendedItems} categoryId={null} />
                ) : (
                  <p className={styles.loading}>推薦商品載入中...</p>
                )}

                <div className={styles.more}>
                  <Link href="../shop/top" style={{ textDecoration: "none" }}>
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
      <Footer />
    </>
  );
}
