import React from 'react';
import styles from '../styles/ActyeditHeader.module.css'


const ActivityHeader = () => {
  return (
    <header className={styles['activity-header']}> {/* 使用 styles['class-name'] 引用樣式 */}
      <h1 className={styles['activity-title']}>開團細項</h1> {/* 使用 styles['class-name'] 引用樣式 */}
    </header>
  );
};

export default ActivityHeader;