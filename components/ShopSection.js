import React from "react";
import "@/styles/index-styles.css";

const ShopSection = () => {
  return (
    <section className="shop-container">
      <div className="shop-header">
        <h2 className="shop-title">商城</h2>
        <p className="shop-promo">(促銷廣告隨機出現) 球鞋 79 折起</p>
      </div>
      <div className="shop-product-list">
        <div className="shop-product-card">
          <div className="shop-product-image"></div>
          <div className="shop-product-name">商品名稱</div>
        </div>
        <div className="shop-product-card">
          <div className="shop-product-image"></div>
          <div className="shop-product-name">商品名稱</div>
        </div>
        <div className="shop-product-card">
          <div className="shop-product-image"></div>
          <div className="shop-product-name">商品名稱</div>
        </div>
      </div>
      <div className="shop-footer">
        <a href="#" className="more-link">查看更多商品</a>
      </div>
    </section>
  );
};

export default ShopSection;
