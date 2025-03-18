"use client";

import { useState, useEffect } from "react";
import { AB_LIST, AVATAR_PATH } from "../../../config/api-path";
import { useAuth } from "@/contexts/auth-context";
import styles from "./card.module.css";

function Card({ startIndex, itemsPerPage }) {
  const { getAuthHeader } = useAuth();
  const [listData, setListData] = useState([]);

  useEffect(() => {
    fetch(AB_LIST, { headers: getAuthHeader() })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setListData(data.rows);
        }
      })
      .catch(console.error);
  }, [getAuthHeader]);

  return (
    <div className={styles.cardContainer}>
      {listData.slice(startIndex, startIndex + itemsPerPage).map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.imgContainer}>
            <img src="/products_pic/top-1.jpg" alt="" />
          </div>
          <div className={styles.cardDetails}>
            <div className={styles.productTitle}>{item.product_name}</div>
            <div className={styles.priceContainer}>
              <div className={styles.price}>NT$ {item.price}</div>
              <div className={styles.cardIcons}>
                <span className={`icon-Like-Stroke ${styles.iconLikeStroke}`} />
                <span className={`icon-Cart ${styles.iconCart}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;
