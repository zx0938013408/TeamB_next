import React from 'react';
import styles from '@/styles/member-activity-edit/Announcements.module.css'; // 請創建這個 CSS Modules 檔案

const Announcements = () => {
  return (
    <section className={styles.announcements}>
      <h2 className={styles['section-title']}>公告紀錄</h2>
      <div className={styles['announcement-list']}>
        <p className={styles['announcement-item']}>消息1</p>
        <p className={styles['announcement-item']}>消息2</p>
        <p className={styles['announcement-item']}>發布開團成功或失敗通知</p>
      </div>
    </section>
  );
};

export default Announcements;