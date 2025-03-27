'use client';

import React, { useEffect, useRef, useState } from 'react';
import "@/styles/index-styles.css";
import ActivityCardIndex from "./activity-card-index/ActivityCardIndex";
import { AL_LIST } from "@/config/api-path";
import Link from "next/link";

const ActivityList = () => {
  const [listData, setListData] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await fetch(`${AL_LIST}`);
        const obj = await r.json();
        if (obj.success) {
          setListData(obj.rows);
        }
      } catch (error) {
        console.warn(error);
      }
    };
    fetchData();
  }, []);

  // ⭐️ 監聽滑鼠滾輪，轉換為橫向滑動
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const handleWheel = (e) => {
      // 僅在裝置為桌機時啟用（手機保留滑動）
      if (window.innerWidth > 768) {
        e.preventDefault();
        scrollEl.scrollLeft += e.deltaY;
      }
    };

    scrollEl.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollEl.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section className="activity-section">
      <div className="activity-container">
        <h2 className="activity-title">活動訊息</h2>
        <div className="activity-scroll-vertical">
          {listData.slice(0, 6).map((activity, i) => (
            <ActivityCardIndex key={i} activity={activity} />
          ))}
          <div className="activity-footer">
  <Link href="/activity-list" className="more-link">
    查看更多活動
  </Link>
</div>
        </div>
      </div>
    </section>
  );
};

export default ActivityList;
