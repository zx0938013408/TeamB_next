'use client'
import React, { useState } from "react";
import styles from '@/styles/member-activity-edit/Canceled.module.css'

const CancelActivity = () => {
  const [selectedReason, setSelectedReason] = useState(null);

  return (
    <section className={styles["cancel-activity"]}>
      <h2 className={styles["section-title"]}>取消開團</h2>
      <div className={styles["cancel-content"]}>
        <label className={styles["reason-option"]}>
          <input
            type="radio"
            name="cancelReason"
            onChange={() => setSelectedReason("天氣")}
          />
          不可控天氣因素
        </label>
        <label className={styles["reason-option"]}>
          <input
            type="radio"
            name="cancelReason"
            onChange={() => setSelectedReason("人數不足")}
          />
          人數未滿，無法成團
        </label>
        <button
          className={
            selectedReason
              ? styles["cancelButton"]
              : styles["cancelButtonDisabled"]
          }
          disabled={!selectedReason}
        >
          取消開團
        </button>
      </div>
    </section>
  );
};

export default CancelActivity;