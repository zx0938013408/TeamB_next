'use client'
import React, { useState } from "react";
import styles from '@/styles/member-activity-edit/Canceled.module.css'

const CancelActivity = () => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (selectedReason) {
      setClicked(true);
      setTimeout(() => setClicked(false), 1000); // 點擊後 1 秒恢復原樣
    }
  };

  return (
    <section className={styles["cancelContent"]}>
      <h2 className={styles["sectionTitle"]}>取消開團</h2>
      <div className={styles["cancelReasons"]}>
        <label className={styles["reasonOption"]}>
          <input
            type="radio"
            name="cancelReason"
            className={styles["reasonRadio"]}
            onChange={() => setSelectedReason("天氣")}
          />
          <span className={styles["radioCustom"]}></span>
          <span className={styles["reasonText"]}>不可控天氣因素</span>
        </label>

        <label className={styles["reasonOption"]}>
          <input
            type="radio"
            name="cancelReason"
            className={styles["reasonRadio"]}
            onChange={() => setSelectedReason("人數不足")}
          />
          <span className={styles["radioCustom"]}></span>
          <span className={styles["reasonText"]}>人數未滿，無法成團</span>
        </label>
      </div>

      <button
        className={`${styles["buttonGeneral"]} ${
          clicked
            ? styles["cancelButtonClicked"]
            : selectedReason
            ? styles["cancelButtonDefault"]
            : styles["cancelButtonDisabled"]
        }`}
        disabled={!selectedReason}
        onClick={handleClick}
      >
        取消開團
      </button>
    </section>
  );
};

export default CancelActivity;