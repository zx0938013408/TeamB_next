import React from 'react';
import styles from '../styles/ParticipantsList.module.css'; // 導入 CSS Modules
import "@/public/TeamB_Icon/style.css"



const ParticipantsList = () => {
  const participants = [
    { name: '陳美麗', cancelCount: 3, absenceCount: 2 },
    { name: '陳美麗', cancelCount: 3, absenceCount: 2 },
    { name: '陳美麗', cancelCount: 3, absenceCount: 2 },
    { name: '陳美麗', cancelCount: 3, absenceCount: 2 },
    { name: '陳美麗', cancelCount: 3, absenceCount: 2 },
  ];

  return (
    <section className={styles['participants-list']}>
      <h2 className={styles['section-title']}>報名成員</h2>
      <div className={styles['list-container']}>
        <button className={styles['table-nav-button'] + ' prev'}>
          <span className={`icon-Left ${styles.iconLeft}`}></span>
        </button>
        <div className={styles['list-content']}>
          <table className={styles['participants-table']}>
            <thead>
              <tr className={styles['table-header']}>
                <th className={styles['header-cell']}>報名成員</th>
                <th className={styles['header-cell']}>取消次數</th>
                <th className={styles['header-cell']}>未到次數</th>
                <th className={styles['header-cell']}>核准</th>
                <th className={styles['header-cell']}>剔除</th>
                <th className={styles['header-cell']}>歷史紀錄</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr className={styles['participant-row']} key={index}>
                  <td className={styles['participants-name']}>{participant.name}</td>
                  <td className={styles['cancel-count']}>{participant.cancelCount}</td>
                  <td className={styles['absence-count']}>{participant.absenceCount}</td>
                  <td className={styles['action-cell']}>
                    <button className={styles['action-button'] + ' approve'}>核准</button>
                  </td>
                  <td className={styles['action-cell']}>
                    <button className={styles['action-button'] + ' reject'}>剔除</button>
                  </td>
                  <td className={styles['action-cell']}>
                    <button className={styles['action-button'] + ' history'}>
                      <a href="#">查看紀錄</a>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <svg
              width="40"
              height="10"
              viewBox="0 0 40 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="5" r="5" fill="#ADADAD" />
              <circle cx="20" cy="5" r="5" fill="#6C7275" />
              <circle cx="35" cy="5" r="5" fill="#6C7275" />
            </svg>
          </div>
        </div>
        <button className={styles['table-nav-button'] + ' next'}>
          <span className="icon-Right"></span>
        </button>
      </div>
    </section>
  );
};

export default ParticipantsList;