//報名此活動的成員管理區 
"use client";
import React,{ useState, useEffect } from 'react';
import styles from '../../styles/member-activity-edit/ParticipantsList.module.css' // 導入 CSS Modules
import "@/public/TeamB_Icon/style.css"
import Participants from './Participants'


const ParticipantsList = () => {
  // 頁數控制
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 2;
  const totalPages = Math.ceil(Participants.length / rowsPerPage);
// 向前一頁
  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
// 向後一頁
  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className={styles['participants-list']}>
      <h2 className={styles['section-title']}>報名成員</h2>
      <div className={styles['list-container']}>
        <button className={`${styles['table-nav-button']} ${styles['prev']}`} onClick={handlePrevClick}>
          <span className="icon-Left"></span>
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
              {Participants.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage).map((participant, index) => (
                <tr className={styles['table-row']} key={index}>
                  <td className={styles['participants-name']}>{participant.name}</td>
                  <td className={styles['cancel-count']}>{participant.cancelCount}</td>
                  <td className={styles['absence-count']}>{participant.absenceCount}</td>
                  <td className={styles['action-cell']}>
                    <button className={`${styles['action-button']} ${styles['approve']}`}>核准</button>
                  </td>
                  <td className={styles['action-cell']}>
                    <button className={`${styles['action-button']} ${styles['reject']}`}>剔除</button>
                  </td>
                  <td className={styles['action-cell']}>
                    <button className={`${styles['action-button']} ${styles['history']}`}>
                      <a href="#">查看紀錄</a>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles['pagination']}>
            <svg width="40" height="10" viewBox="0 0 40 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {Array.from({ length: totalPages }).map((_, index) => (
                <circle
                  key={index}
                  cx={5 + index * 15}
                  cy="5"
                  r="5"
                  fill={index === currentPage ? '#6C7275' : '#ADADAD'}
                />
              ))}
            </svg>
          </div>
        </div>
        <button className={`${styles['table-nav-button']} ${styles['next']}`} onClick={handleNextClick}>
          <span className="icon-Right"></span>
        </button>
      </div>
    </section>
  );
};

export default ParticipantsList;