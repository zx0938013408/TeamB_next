import React from "react";
import styles from "@/app/cart/cart.module.css"; // 假設你的樣式在這個檔案

const TableHeader = () => {
  return (
    <thead className={styles.thead}>
      <tr>
        <th className={styles.checked}></th>
        <th className={styles.titlePicture}></th>
        <th className={styles.titleName}>商品名稱</th>
        <th className={styles.titleSpec}>規格</th>
        <th className={styles.titlePrice}>單價</th>
        <th className={styles.titleCount}>數量</th>
        <th className={styles.titleSuntotal}>小計</th>
        <th className={styles.titleRemove}>刪除</th>
      </tr>
    </thead>
  );
};

export default TableHeader;

