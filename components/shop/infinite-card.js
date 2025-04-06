"use client";

import { useState, useEffect, useRef } from "react";
import { AVATAR_PATH } from "@/config/api-path";
import styles from "../../styles/shop/infinite-card.module.css";
import LikeHeart from "../like-hearts";
import Link from "next/link";

function InfiniteCard({ categoryId, items = [], linkPath = "/shop" }) {
  const [visibleData, setVisibleData] = useState([]); // 當前顯示的資料
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // 每次載入 5 筆
  const observer = useRef(null);
  const filteredItems = categoryId
  ? items.filter((item) => String(item.category_id) === String(categoryId))
  : items;

  // 滾動載入更多
  useEffect(() => {
    setVisibleData(filteredItems.slice(0, itemsPerPage));
    setPage(1);
  }, [categoryId, items]); // 當分類變更時重置

  useEffect(() => {
    if (observer.current) {
      const observerInstance = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreData();
          }
        },
        { threshold: 1.0 }
      );
      observerInstance.observe(observer.current);
      return () => observerInstance.disconnect();
    }
  }, [visibleData]);

  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = filteredItems.slice(0, nextPage * itemsPerPage);

    setVisibleData(nextData);
    setPage(nextPage);
  };
  

  return (
    <div className={styles.cardContainer}>
      {visibleData.map((item, index) => (
          <Link href={`${linkPath}/${item.id}`} passHref key={`pd-${item.id}`}>
            <div
              key={item.id}
              className={styles.card}
              ref={index === visibleData.length - 1 ? observer : null}
            >
            

              <div className={styles.imgContainer}>
                <img src={`${AVATAR_PATH}/${item.image}`} alt={item.product_name} />
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.productTitle}>{item.product_name}</div>
                <div className={styles.priceContainer}>
                  <div className={styles.price}>NT$ {item.price}</div>
                  <div className={styles.cardIcons}>
                    
                  </div>
                </div>
              </div>
            </div>
          </Link>
      ))}

      {visibleData.length < filteredItems.length && (
        <div className={styles.loading}>載入中...</div>
      )}
    </div>
  );
}

export default InfiniteCard;
