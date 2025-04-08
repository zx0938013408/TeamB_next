"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation"; // 使用 next/navigation 的 useParams
import { AB_ITEM_GET, AVATAR_PATH, AB_LIST } from "@/config/shop-api-path";
import styles from "./product-detail.module.css";
import "../../../public/TeamB_Icon/style.css";
import Carousel from "../../../components/shop/carousel";
import MobileCarousel from "@/components/shop/MobileCarousel";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductLikeButton from "@/components/shop/ProductLikeButton";
import { useCart } from "@/hooks/use-cart";
import { ToastContainer, toast } from "react-toastify";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function ProductDetailPage() {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [recommendedItems, setRecommendedItems] = useState([]); // ✅ 確保 hooks 不變
  const params = useParams();
  const pd_id = params.pd_id;
  const [liked, setLiked] = useState(false); // 控制愛心狀態
  const [loading, setLoading] = useState(true); // 防止閃爍
  const { onAdd } = useCart();
  const [sizes, setSizes] = useState([]); // 存儲尺寸
  const [selectedSize, setSelectedSize] = useState(""); //依不同尺寸的庫存
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false); // 判斷是否為手機板
  const [hasMounted, setHasMounted] = useState(false); //防止畫面閃爍或 hydration 錯誤

  //判斷是否為手機板 防止畫面閃爍或 hydration 錯誤
  useEffect(() => {
    setHasMounted(true);
    setIsMobile(window.innerWidth <= 768);
    const resizeHandler = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

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

          if (
            productData.sizes &&
            productData.stocks &&
            productData.variant_ids
          ) {
            const sizeNames = productData.sizes.split(","); // ['M', 'L', ...]
            const stockNumbers = productData.stocks.split(",").map(Number); // [10, 20, ...]
            const variantIds = productData.variant_ids.split(",").map(Number); // [3, 4, ...]

            const sizeInfo = sizeNames.map((size, i) => ({
              id: variantIds[i],
              size: size,
              stock: stockNumbers[i] ?? 0,
            }));

            setSizes(sizeInfo); // 傳給 select
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
        const res = await fetch(`${AB_ITEM_GET}/pd_likes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: product.id,
            toggle: false, // ✅ 只查詢不切換
          }),
        });

        const data = await res.json();
        if (data.success) {
          setLiked(data.liked); // ✅ 正確設定紅或灰
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

  if (!hasMounted) return null;

  if (!product) {
    return <p className={styles.loading}>美美的商品載入中...</p>;
  }

  // 數量按鈕增加和減少
  const increase = () => {
    if (!selectedSize) {
      toast.error("請先選擇尺寸");
      return;
    }

    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // 購物車
  const handleAddToCart = (redirect = false) => {
    const qty = quantity;
    console.log("✅ 選擇的尺寸：", selectedSize);
    console.log("✅ 選擇的數量：", quantity);

    if (!selectedSize || qty < 1) {
      toast.error("請選擇尺寸和數量");
      return;
    }

    if (qty > selectedSize.stock) {
      toast.error(`庫存不足，僅剩 ${selectedSize.stock} 件`);
      return;
    }

    onAdd({
      id: selectedSize.id, // ✅ 用尺寸_庫存表的主鍵 id 當購物車識別用
      product_id: product.id,
      size: selectedSize.size,
      size_id: selectedSize.id, // ✅ 傳給後端用
      quantity: qty,
      price: product.price,
      product_name: product.product_name,
      image: product.image,
      color: product.color,
    });
    console.log(
      "✅ 加入購物車的尺寸 ID 是",
      selectedSize.id,
      typeof selectedSize.id
    );
    notify(product.product_name); // ✅ 加入成功提示

    // 立即購買會跳頁到購物車
    if (redirect) {
      router.push("/cart"); // 立即購買時導向購物車
    }
  };

  // toast提示通知
  const notify = (name) => {
    toast.success(`${name} 成功加入購物車!`);
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
                          {(product.parent_category_name || "未分類") +
                            (product.sub_category_name
                              ? ` / ${product.sub_category_name}`
                              : "")}
                        </div>
                        <ProductLikeButton
                          productId={product.id}
                          checked={liked}
                        />
                      </div>
                      <div className={styles.productName}>
                        {product.product_name}
                        <br />
                        {product.color}
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
                    {/* 選擇尺寸 */}
                    <select
                      className={styles.sizeSection}
                      onChange={(e) => {
                        e.target.blur(); // 取消 focus，避免完跳到最上面
                        const selectedId = Number(e.target.value);
                        const found = sizes.find((s) => s.id === selectedId);
                        if (found) {
                          setSelectedSize(found);
                          setQuantity(1); // 切換尺寸時重設數量
                        } else {
                          toast.error("找不到對應尺寸");
                        }
                      }}
                      value={selectedSize?.id || ""}
                    >
                      <option value="">尺寸</option>
                      {sizes.map((size) => (
                        <option key={size.id} value={size.id}>
                          {size.size}
                        </option>
                      ))}
                    </select>

                    {/* 選擇數量 */}
                    <div className={styles.quantity}>
                      <div className={styles.quantityWrapper}>
                        <button
                          onClick={decrease}
                          disabled={quantity <= 1}
                          className={`${styles.qtyBtn} ${
                            quantity <= 1 ? styles.disabled : ""
                          }`}
                        >
                          –
                        </button>
                        <div className={styles.qtyNumber}>{quantity}</div>
                        <button
                          onClick={increase}
                          disabled={
                            !selectedSize || quantity >= selectedSize.stock
                          }
                          className={`${styles.qtyBtn} ${
                            !selectedSize || quantity >= selectedSize.stock
                              ? styles.disabled
                              : ""
                          }`}
                        >
                          +
                        </button>
                      </div>
                      {/* 庫存顯示 */}
                      <div className={styles.inventory}>
                        {selectedSize
                          ? `庫存：${selectedSize.stock ?? 0} 件`
                          : "請先選擇尺寸"}
                      </div>
                    </div>
                    <div className={styles.buttons}>
                      <button
                        className={styles.btnPrimary}
                        onClick={() => handleAddToCart(false)}
                      >
                        加入購物車
                      </button>
                      <button
                        className={styles.btnSecondary}
                        onClick={() => handleAddToCart(true)}
                      >
                        立即購買
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <ToastContainer />

              {/* 商品詳情 */}
              <div className={styles.bContainer}>
                <div className={styles.title}>商品詳情</div>
                <img
                  src="/photo/ProductDetail_1.png"
                  alt={product.product_name}
                  className={styles.detailImage}
                />
                <div className={styles.descriptionOverlay}>
                  {product.product_description}
                </div>
                {/* <div
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
                </div> */}
              </div>

              {/* 大家還看了 */}
              <div className={styles.itemsSection}>
                <div className={styles.titleBg}>
                  <div className={styles.title}>大家還看了</div>
                </div>
                {recommendedItems.length > 0 ? (
                  isMobile ? (
                    <MobileCarousel items={recommendedItems} />
                  ) : (
                    <Carousel items={recommendedItems} categoryId={null} />
                  )
                ) : (
                  <p className={styles.loading}>推薦商品載入中...</p>
                )}

                {/* <div className={styles.more}>
                  <Link href="../shop/top" style={{ textDecoration: "none" }}>
                    <div className={styles.textBox}>
                      <div className={styles.text}>查看更多</div>
                      <span className={`icon-Right ${styles.iconRight}`} />
                    </div>
                  </Link>
                </div> */}
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
