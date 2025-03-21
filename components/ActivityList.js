import React from "react";
import "@/styles/index-styles.css";

const ActivityList = () => {
  return (
    <section className="activity-container">
      <h2 className="activity-title">活動訊息</h2>
      <div className="activity-box">
        <div className="activity-item"><a href="#">3/03 pm5:00 永康 羽潮 缺3人</a></div>
        <div className="activity-item"><a href="#">3/03 pm5:00 永康 羽潮 缺3人</a></div>
        <div className="activity-item"><a href="#">3/03 pm5:00 永康 羽潮 缺3人</a></div>
        <div className="activity-item"><a href="#">3/03 pm5:00 永康 羽潮 缺3人</a></div>
      </div>
      <div className="activity-footer">
        <a href="#" className="more-link">查看更多活動</a>
      </div>
    </section>
  );
};

export default ActivityList;
