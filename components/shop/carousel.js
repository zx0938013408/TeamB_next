"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/shop/carousel.module.css";
import Card from "./card";
import { string } from "zod";
import dynamic from "next/dynamic";

function Carousel({ items = [], categoryId }) {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // 🔍 是否為手機
  const itemsPerPage = isMobile ? 1 : 4; //一頁幾張卡
  const MobileCarousel = dynamic(() => import("./MobileCarousel"), { ssr: false });

  // 判斷裝置是否為手機
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 手機寬度閾值
    };

    handleResize(); // 初始執行一次
    window.addEventListener("resize", handleResize); // 監聽尺寸變化
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 根據 categoryId 過濾商品，null 時返回所有商品
  const filteredItems = categoryId
    ? items?.filter(
        (item) => String(item?.category_id) === String(categoryId)
      ) || []
    : items || [];

  // ✅ 防止滑動超出範圍（例如 itemsPerPage 改變導致 startIndex 無效）
  useEffect(() => {
    if (startIndex + itemsPerPage > filteredItems.length) {
      setStartIndex(Math.max(0, filteredItems.length - itemsPerPage));
    }
  }, [itemsPerPage, filteredItems.length]);

  // 如果沒資料進來就不顯示按鈕
  if (filteredItems.length === 0) {
    return <p className={styles.loading}>暫無推薦商品</p>;
  }

  // 控制左右鍵
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + itemsPerPage < filteredItems.length;

  return isMobile ? (
    <MobileCarousel items={filteredItems} />
  ) : (
    <div className={styles.carouselContainer}>
      {/* 左鍵 */}
      <button
        onClick={() => setStartIndex(Math.max(0, startIndex - itemsPerPage))}
        disabled={!canGoPrev}
        className={`${styles.iconButton} ${styles.leftArrow}`}
      >
        <span className={`icon-Left ${styles.iconInner} ${styles.iconLeft}`} />
      </button>
  
      {/* 卡片 */}
      <div className={styles.cardWrapper}>
        {filteredItems
          .slice(startIndex, startIndex + itemsPerPage)
          .map((item) => (
            <Card key={`pd-${item.id}`} item={item} />
          ))}
      </div>
  
      {/* 右鍵 */}
      <button
        onClick={() =>
          setStartIndex(
            Math.min(filteredItems.length - itemsPerPage, startIndex + itemsPerPage)
          )
        }
        disabled={!canGoNext}
        className={`${styles.iconButton} ${styles.rightArrow}`}
      >
        <span className={`icon-Right ${styles.iconInner} ${styles.iconRight}`} />
      </button>
    </div>
  );
  
}

export default Carousel;
