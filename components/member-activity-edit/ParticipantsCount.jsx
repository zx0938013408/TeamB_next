import React from 'react';
import styles from '../../styles/member-activity-edit/page.module.css'

const ParticipantsCount = ({ currentCount, totalCount }) => {
  return (
    <section className={styles['participants-count']}>
            <h2 className={styles['section-title']}>目前報名人數</h2>
      <p className={styles['count-display']}>
        {currentCount}/{totalCount}人
      </p>
    </section>
  );
};

export default ParticipantsCount;