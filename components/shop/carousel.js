"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "../../../config/api-path";
import { useAuth } from "@/contexts/auth-context";
import Card from "./card";
import styles from "./carousel.module.css";

function Carousel() {
  const { getAuthHeader } = useAuth();
  const [listData, setListData] = useState([]); 
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4; 

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    fetch(`${AB_LIST}`, {
      headers: { ...getAuthHeader() },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setListData(data.rows || []);
        }
      })
      .catch(console.warn);
  }, [getAuthHeader]);

  const handleNext = () => {
    if (startIndex + itemsPerPage < listData.length) {
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
      <button onClick={handlePrev}  disabled={startIndex === 0} className={styles.iconButton}>
      <span className={`icon-Left ${styles.iconButton} ${disabled ? 'disabled' : ''}`}></span>
      </button>

      {/* 卡片組件放中間 */}
      <div className={styles.cardWrapper}>
        <Card listData={listData} startIndex={startIndex} itemsPerPage={itemsPerPage} />
      </div>

      {/* 右按鈕 */}
      <button onClick={handleNext} disabled={startIndex + itemsPerPage >= listData.length} className={styles.iconButton}>
      <span className={`icon-Right ${styles.iconRight} ${disabled ? 'disabled' : ''}`}></span>
      </button>
    </div>
  );
}

export default Carousel;
