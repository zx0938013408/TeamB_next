"use client";

import { useState, useEffect } from "react";
import styles from "../../styles/shop/carousel.module.css";
import Card from "./card";
import { string } from "zod";

function Carousel({ items = [], categoryId, itemsPerPage = 4 }) {
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false); // 🔍 是否為手機

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

  // 如果沒資料進來就不顯示按鈕
  if (filteredItems.length === 0) {
    return <p className={styles.loading}>暫無推薦商品</p>;
  }

  // 控制左右鍵
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex + itemsPerPage < filteredItems.length;

  return (
    <div className={styles.carouselContainer}>
      {/* 左鍵 */}
      {!isMobile && (
        <button
          onClick={() =>
            setStartIndex((prev) => Math.max(0, prev - itemsPerPage))
          }
          disabled={!canGoPrev}
          className={`${styles.iconButton} ${styles.leftArrow}`}
        >
          <span className={`icon-Left ${styles.iconInner} ${styles.iconLeft}`}></span>
        </button>
      )}

      {/* 卡片組件放中間 */}
      <div
        className={`${styles.cardWrapper} ${
          isMobile ? styles.mobileScroll : ""
        }`}
      >
        {isMobile
          ? filteredItems.map((item) => (
              <div className={styles.scrollItem} key={`pd-${item.id}`}>
                <Card item={item} />
              </div>
            ))
          : filteredItems
              .slice(startIndex, startIndex + itemsPerPage)
              .map((item) => <Card key={`pd-${item.id}`} item={item} />)}
      </div>

      {/* 右鍵 */}
      {!isMobile && (
        <button
          onClick={() =>
            setStartIndex((prev) =>
              Math.min(filteredItems.length - itemsPerPage, prev + itemsPerPage)
            )
          }
          disabled={!canGoNext}
          className={`${styles.iconButton} ${styles.rightArrow}`}
        >
          <span className={`icon-Right ${styles.iconInner} ${styles.iconRight}`}></span>
        </button>
      )}
    </div>
  );
}

export default Carousel;
