"use client";

import Link from "next/link";
import styles from "../../styles/shop/card.module.css";
import { AVATAR_PATH } from "@/config/api-path";

// 參數item、愛心跟購物車是否出現
function Card({ item, showLike = true, showCart = true }) {
  // console.log("🃏 渲染卡片 id:", item.id, item.product_name);
  return (
    <Link href={`/shop/${item.id}`} passHref>
      <div key={item.id} className={styles.card}>
        <div className={styles.imgContainer}>
          <img src={`${AVATAR_PATH}/${item.image}`} alt={item.product_name} />
        </div>
        <div className={styles.cardDetails}>
          <div className={styles.productTitle}>{item.product_name}</div>
          <div className={styles.priceContainer}>
            <div className={styles.price}>NT$ {item.price}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
