"use client";

import { useState, useEffect, useRef } from "react";
import { AB_LIST } from "../../config/shop-api-path";
import { useAuth } from "../../context/auth-context";
import styles from "../../styles/shop/infinite-card.module.css";
import LikeHeart from "../like-hearts";

function InfiniteCard({ categoryId }) {
  const { getAuthHeader } = useAuth();
  const [listData, setListData] = useState([]); // 所有加載的資料
  const [visibleData, setVisibleData] = useState([]); // 當前顯示的資料
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // 每次載入 5 筆
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef(null);

  useEffect(() => {
    fetch(AB_LIST, { headers: getAuthHeader() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // 過濾出符合該分類的資料
          const filteredData = data.rows.filter(
            (item) => item.category_id === categoryId
          );
          setListData(filteredData);
          setVisibleData(filteredData.slice(0, itemsPerPage)); // 初始顯示 9 筆
          setHasMore(filteredData.length > itemsPerPage);
        }
      })
      .catch(console.warn);
  }, [getAuthHeader, categoryId]);

  // 滾動載入更多
  useEffect(() => {
    if (!hasMore) return;

    const lastCardRef = observer.current;
    if (lastCardRef) {
      const observerInstance = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreData();
          }
        },
        { threshold: 1.0 }
      );
      observerInstance.observe(lastCardRef);
      return () => observerInstance.disconnect();
    }
  }, [hasMore, visibleData]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = listData.slice(0, nextPage * itemsPerPage);

    setVisibleData(nextData);
    setPage(nextPage);
    if (nextData.length >= listData.length) {
      setHasMore(false);
    }
  };

  return (
    <div className={styles.cardContainer}>
      {visibleData.map((item, index) => (
        <div
          key={item.id}
          className={styles.card}
          ref={index === visibleData.length - 1 ? observer : null}
        >
          <div className={styles.imgContainer}>
            <img src="/photo/products_pic/top-1.jpg" alt={item.product_name} />
          </div>
          <div className={styles.cardDetails}>
            <div className={styles.productTitle}>{item.product_name}</div>
            <div className={styles.priceContainer}>
              <div className={styles.price}>NT$ {item.price}</div>
              <div className={styles.cardIcons}>
              <LikeHeart/>
                {/* <span className={`icon-Like-Stroke ${styles.iconLikeStroke}`} /> */}
                <span className={`icon-Cart ${styles.iconCart}`} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {hasMore && <div className={styles.loading}>載入中...</div>}
    </div>
  );
}

export default InfiniteCard;
