'use client'

import React from "react";
import "@/styles/index-styles.css";
import ActivityCardIndex from "./activity-card-index/ActivityCardIndex";
import { useRef, useState, useEffect } from "react";
import { AL_LIST } from "@/config/api-path";
import Link from "next/link";


const ActivityList = () => {
  const [listData, setListData] = useState([]);
  const [activityName, setActivityName] = useState(null);


    useEffect(() => {
      const controller = new AbortController();
      const signal = controller.signal;
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
    console.log("data:", listData);
  return (
    <section className="activity-container">
      <h2 className="activity-title">活動訊息</h2>
      <div className="activity-box">
        {listData.length > 0 ? (
          listData.slice(0, 6).map((activity, i) => (
            <ActivityCardIndex
              key={i}
              activity={activity}
              onQuickSignUp={setActivityName}
            />
          ))
        ) : (
          <p >目前沒有活動</p>
        )}
        
      </div>
      <div className="activity-footer">
        <Link href="/activity-list" className="more-link">查看更多活動</Link>
      </div>
    </section>
  );
};

export default ActivityList;
