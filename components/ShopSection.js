import React, { useState, useEffect } from "react";
import StylesShop from "@/styles/shop/card.module.css";
import "@/styles/index-styles.css";
import { AB_LIST as SHOP_AB_LIST } from "@/config/shop-api-path";
import { AVATAR_PATH } from "@/config/api-path";

const ShopSection = () => {
  const [recommendedItems, setRecommendedItems] = useState([]);

  useEffect(() => {
    const fetchRecommendedItems = async () => {
      try {
        const res = await fetch(SHOP_AB_LIST);
        if (!res.ok) throw new Error("載入推薦商品失敗");

        const data = await res.json();

        if (data.success && data.rows) {
          const randomItems = [...data.rows]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3); // 只取 3 筆
          setRecommendedItems(randomItems);
        }
      } catch (error) {
        console.error("❌ 錯誤:", error);
      }
    };

    fetchRecommendedItems();
  }, []);

  return (
    <section className="shop-container">
      <div className="shop-header">
        <h2 className="shop-title">商城</h2>
        <p className="shop-promo">(促銷廣告隨機出現) 球鞋 79 折起</p>
      </div>
      <div className="shop-product-list">
      {recommendedItems.map((item) => (
        <div className="shop-product-card"  key={`pd-${item.id}`}>
          <div className="shop-product-image">
            <div className={StylesShop.imgContainer}>
              <img
                src={`${AVATAR_PATH}/${item.image}`}
                alt={item.product_name}
                className="cardImg"
              />
            </div>
          </div>
          <div className="shop-product-name">
            <div className={StylesShop.productTitle}>{item.product_name}</div>
            <div className={StylesShop.price}>NT$ {item.price}</div>
          </div>
        </div>
      ))}
      </div>
      <div className="shop-footer">
        <a href="/shop" className="more-link">查看更多商品</a>
      </div>
    </section>
  );
};

export default ShopSection;
