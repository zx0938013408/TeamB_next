"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "../../config/shop-api-path";
import { useAuth } from "../../context/auth-context";
import Card from "./card";
import styles from "../../styles/shop/carousel.module.css";

function Carousel({ categoryId }) {
  const { getAuthHeader } = useAuth();
  const [listData, setListData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;
  // 控制分類出現的數量
  const [categoryLength, setCategoryLength] = useState(0); 

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetch(AB_LIST, {
      headers: { ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          setListData(data.rows || []);
        }
      })
      .catch(console.warn);
  }, [getAuthHeader]);

  const handleNext = () => {
    if (startIndex + itemsPerPage < categoryLength) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      {/* 左按鈕 */}
      <button
        onClick={handlePrev}
        disabled={startIndex === 0}
        className={styles.iconButton}
      >
        <span
          className={`icon-Left ${styles.iconButton} ${
            disabled ? "disabled" : ""
          }`}
        ></span>
      </button>

      {/* 卡片組件放中間 */}
      <div className={styles.cardWrapper}>
        <Card
          listData={listData}
          categoryId={categoryId}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          setCategoryLength={setCategoryLength} // 讓 Card 回傳該分類的資料長度
        />
      </div>

      {/* 右按鈕 */}
      <button
        onClick={handleNext}
        // disabled確認沒有數量之後不會再換到空白的一頁
        disabled={startIndex + itemsPerPage >= listData.length}
        className={styles.iconButton}
      >
        <span
          className={`icon-Right ${styles.iconRight} ${
            disabled ? "disabled" : ""
          }`}
        ></span>
      </button>
    </div>
  );
}

export default Carousel;
