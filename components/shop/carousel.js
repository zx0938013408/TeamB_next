"use client";

import { useState } from "react";
import styles from "../../styles/shop/carousel.module.css";
import Card from "./card";
import { string } from "zod";

function Carousel({ items = [], categoryId, itemsPerPage = 4 }) {
  const [startIndex, setStartIndex] = useState(0);

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
      <button
        onClick={() =>
          setStartIndex((prev) => Math.max(0, prev - itemsPerPage))
        }
        disabled={!canGoPrev}
        className={styles.iconButton}
      >
        <span className={`icon-Left ${styles.iconButton}`}></span>
      </button>

      {/* 卡片組件放中間 */}
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
          setStartIndex((prev) =>
            Math.min(filteredItems.length - itemsPerPage, prev + itemsPerPage)
          )
        }
        disabled={!canGoNext}
        className={styles.iconButton}
      >
        <span className={`icon-Right ${styles.iconRight}`}></span>
      </button>
    </div>
  );
}

export default Carousel;
