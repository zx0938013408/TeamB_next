"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // 使用 next/navigation 的 useParams
import { AB_ITEM_GET } from "@/config/shop-api-path";
import styles from "./product-detail.module.css";
import "../../../public/TeamB_Icon/style.css";
import Carousel from "../../../components/shop/carousel";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LikeHeart from "@/components/like-hearts";

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const params = useParams();
  const pd_id = params.pd_id;

  useEffect(() => {
    if (!pd_id) return;

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

  if (!product) {
    return <p className={styles.loading}>載入中...</p>;
  }

  return (
    <>
      <Header />
      <div className={styles.body}>
        <div className={styles.container}>
          {/* 商品詳情展示區 */}
          <div className={styles.aContainer}>
            <div className={styles.leftSection}>
              <div className={styles.mainImage}>
                {/* {product.mainImage?.map((image, index) => (
                  <img key={index} src={image} alt={`大圖${index + 1}`} />
                ))} */}
                <img
                  src={product.imageUrl || "/photo/products_pic/top-1.jpg"}
                  alt="商品圖片"
                />
              </div>
              <div className={styles.thumbnailImages}>
                {/* {product.thumbnailImages?.map((image, index) => (
                  <img key={index} src={image} alt={`縮略圖${index + 1}`} />
                ))} */}
                <img
                  src={product.imageUrl || "/photo/products_pic/top-1.jpg"}
                  alt="商品圖片"
                />
                <img
                  src={product.imageUrl || "/photo/products_pic/top-1.jpg"}
                  alt="商品圖片"
                />
                <img
                  src={product.imageUrl || "/photo/products_pic/top-1.jpg"}
                  alt="商品圖片"
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
                  <LikeHeart/>
                </div>
                  <div className={styles.productName}>
                    {product.product_name}
                  </div>
                </div>
                <div>
                  <span className={styles.detailPrice}>NT$</span>
                  <span className={styles.detailPrice}>{product.price}</span>
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
                  <div className={styles.inventory}>庫存：{product.inventory} 件</div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles.btnPrimary}>加入購物車</button>
                  <button className={styles.btnSecondary}>立即購買</button>
                </div>
              </div>
            </div>
          </div>

          {/* 商品詳情 */}
          <div className={styles.bContainer}>
            <div className={styles.title}>商品詳情</div>
            <div className={styles.bDetailSection}>
              {product.detailImages?.map((image, index) => (
                <img key={index} src={image} alt={`商品詳情圖片${index + 1}`} />
              ))}
            </div>
          </div>

          {/* 大家還看了 */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>大家還看了</div>
            </div>
            <Carousel categoryId={product.categoryId} />

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
      <Footer />
    </>
  );
}
