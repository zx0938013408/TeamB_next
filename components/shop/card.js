"use client";

import Link from "next/link";
import styles from "../../styles/shop/card.module.css";
import LikeHeart from "../like-hearts";

// 參數item、愛心跟購物車是否出現
function Card({ item, showLike = true, showCart = true }) {
  return (
    <Link href={`/shop/${item.id}`} passHref>
      <div key={item.id} className={styles.card}>
        <div className={styles.imgContainer}>
          <img src={"/photo/products_pic/top-1.jpg"} alt={item.product_name} />
          {/* <img src={`${AVATAR_PATH}/${item.image}`} alt={item.product_name} /> */}
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.productTitle}>{item.product_name}</div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>NT$ {item.price}</div>
            <div className={styles.cardIcons}>
              {showLike && <LikeHeart />} {/* 控制是否顯示愛心 */}
              {showCart && (
                <span className={`icon-Cart ${styles.iconCart}`} />
              )}{" "}
              {/* 控制是否顯示購物車 */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
