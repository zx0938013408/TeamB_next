import React from 'react';
import styles from '@/styles/member-activity-edit/page.module.css'

// 標題:開團細項
const Title = () => {
  return (
    <div className={styles['activity-header']}> {/* 使用 styles['class-name'] 引用樣式 */}
      <h1 className={styles['activity-title']}>開團細項</h1> {/* 使用 styles['class-name'] 引用樣式 */}
    </div>
  );
};

export default Title;