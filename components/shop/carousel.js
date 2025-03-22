"use client";

import { useState } from "react";
import styles from "../../styles/shop/carousel.module.css";
import Card from "./card";

function Carousel({ items = [], categoryId, itemsPerPage = 4 }) {
  const [startIndex, setStartIndex] = useState(0);

  // ✅ 根據 categoryId 過濾商品
  const filteredItems = items?.filter((item) => 
    categoryId && item?.category_id === categoryId
  ) || [];

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
            <Card key={item.id} item={item} />
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
