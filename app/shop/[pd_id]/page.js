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
import ProductLikeButton from "@/components/shop/ProductLikeButton";
import Search from "@/components/shop/Search";
import { useCart } from "@/hooks/use-cart";
import { ToastContainer, toast } from "react-toastify";

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]); // ✅ 確保 hooks 不變
  const params = useParams();
  const pd_id = params.pd_id;
  const [liked, setLiked] = useState(false); // 控制愛心狀態
  const [loading, setLoading] = useState(true); // 防止閃爍
  const { onAdd } = useCart();
  const [sizes, setSizes] = useState([]); // 存儲尺寸
  const [stock, setStock] = useState({}); // 存儲庫存數量
  const [selectedSize, setSelectedSize] = useState(""); //儲存庫存
  const [selectedQuantity, setSelectedQuantity] = useState(""); //儲存選擇數量

  // 引用 select 元素
  const sizeRef = useRef(null);
  const quantityRef = useRef(null);

  // toast
  const notify = (name) => {
    toast.success(`${name} 成功加入購物車!`);
  };

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
        const data = JSON.parse(responseText);
        console.log("📄 API 回應內容:", responseText);
        try {
          return JSON.parse(responseText);
        } catch (error) {
          throw new Error("❌ API 回應的不是 JSON，可能是錯誤頁面");
        }
      })
      .then((data) => {
        console.log("📦 API 回傳資料:", data);
        if (data.success && data.data) {
          const productData = data.data;

          setProduct(productData);

          // 先檢查 productData 中是否有 size 和 stock 資料
          console.log("商品資料:", productData);

          if (productData.sizes && productData.stocks) {
            const sizes = productData.sizes.split(","); // ['S', 'M', 'L']
            const stocks = productData.stocks.split(",").map(Number); // [10, 20, 15]

            setSizes(sizes);
            setStock(
              sizes.reduce((acc, size, i) => {
                acc[size] = stocks[i] ?? 0;
                return acc;
              }, {})
            );
          } else {
            console.error("❌ 無法找到 size 或 stock 資料");
          }
        } else {
          console.error("API 回傳錯誤:", data.error);
        }
      })
      .catch((error) => console.error("❌ fetch 錯誤:", error));
  }, [pd_id]);

  // 取得收藏資料
  useEffect(() => {
    if (!product || !product.id) return; // 🧠 等 product 載入再執行
    const fetchInitialLike = async () => {
      const userData = localStorage.getItem("TEAM_B-auth");
      const parsedUser = JSON.parse(userData);
      const token = parsedUser?.token;

      if (!token) return;

      try {
        const res = await fetch(`${AB_ITEM_GET}/pd_likes/check/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setLiked(data.liked);
        }
      } catch (err) {
        console.error("取得收藏狀態失敗", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialLike();
  }, [product]);

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
    const qty = parseInt(selectedQuantity, 10);
    console.log("✅ 選擇的尺寸：", selectedSize);
    console.log("✅ 選擇的數量：", selectedQuantity);

    if (!selectedSize || isNaN(qty) || qty < 1) {
      toast.error("請選擇尺寸和數量");
      return;
    }

    const availableStock = stock[selectedSize] || 0;
    if (selectedQuantity > availableStock) {
      toast.error(`庫存不足，僅剩 ${availableStock} 件`);
      return;
    }

    // 這裡把選擇的尺寸和數量傳遞給 onAdd
    onAdd({
      id: product.id,
      product_name: product.product_name,
      price: product.price,
      color: product.color,
      size: selectedSize,
      quantity: qty,
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
                        <ProductLikeButton
                          productId={product.id}
                          checked={liked}
                        />
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
                    <select
                      className={styles.sizeSection}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      value={selectedSize}
                    >
                      <option className={styles.dropdown} value="">
                        尺寸
                      </option>
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <div className={styles.quantity}>
                      <select
                        className={styles.quantitySection}
                        value={selectedQuantity}
                        onChange={(e) => setSelectedQuantity(e.target.value)}
                      >
                        <option className={styles.dropdown}>數量</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                      <div className={styles.inventory}>
                        {selectedSize
                          ? `庫存：${stock[selectedSize] ?? 0} 件`
                          : "請先選擇尺寸"}
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      <button
                        className={styles.btnPrimary}
                        onClick={handleAddToCart}
                      >
                        加入購物車
                      </button>
                      <button className={styles.btnSecondary}>立即購買</button>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer />

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
