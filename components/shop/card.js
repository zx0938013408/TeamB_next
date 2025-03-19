"use client";

import { useState, useEffect } from "react";
import { AB_LIST, AVATAR_PATH } from "../../config/shop-api-path";
import { useAuth } from "../../contexts/auth-context";
import styles from "../../styles/shop/card.module.css";

function Card({ listData, categoryId, startIndex, itemsPerPage, setCategoryLength }) {
  // const { getAuthHeader } = useAuth();
  // const [listData, setListData] = useState([]);

  // 過濾該分類的資料，並限制最多 9 筆
  const filteredData = listData
    .filter((item) => item.category_id === categoryId)
    .slice(0, 9);

  // 把該分類的資料數量回傳給 Carousel
  useEffect(() => {
    setCategoryLength(filteredData.length);
  }, [filteredData.length, setCategoryLength]);

  // useEffect(() => {
  //   fetch(AB_LIST, { headers: getAuthHeader() })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.success) {
  //         setListData(data.rows);
  //       }
  //     })
  //     .catch(console.error);
  // }, [getAuthHeader]);



  return (
    <div className={styles.cardContainer}>
      {filteredData.slice(startIndex, startIndex + itemsPerPage).map((item) => (
        <div key={item.id} className={styles.card}>
          <div className={styles.imgContainer}>
            <img src="/photo/products_pic/top-1.jpg" alt={item.product_name} />
            {/* <img src={`${AVATAR_PATH}/${item.image}`} alt={item.product_name} /> */}
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
