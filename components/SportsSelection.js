"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "@/styles/index-styles.css";


const SportsSelection = React.forwardRef((_, ref) => {
  const router = useRouter();
  const [selectedSport, setSelectedSport] = useState(null);
  const iconRefs = useRef([]);

  const handleSportClick = (sport) => {
    setSelectedSport(sport);

    // 🧠 對照顯示用中文文字
    const sportMap = {
      basketball: "籃球",
      volleyball: "排球",
      badminton: "羽球",
    };

    const keyword = sportMap[sport] || "";
    // ✅ 清理可能干擾跳轉樣式的 DOM 狀態（例如 modal 開啟時的 body 狀態）
    if (typeof window !== "undefined") {
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "auto";
    }

    // ✅ 跳轉到活動列表並附帶搜尋關鍵字
    router.push(`/activity-list?search=${encodeURIComponent(keyword)}`);
  };

  const getSportClass = (sport) => {
    return sport === selectedSport ? 'selected' : '';
  };

  // 搖晃動畫觸發器
  const triggerShake = () => {
    iconRefs.current.forEach((icon) => {
      if (icon) {
        icon.classList.add("shake");
        setTimeout(() => icon.classList.remove("shake"), 600);
      }
    });

    // const target = document.getElementById("sports-middle");
    // target?.scrollIntoView({ behavior: "smooth" });
  };
    

  return (
    <section ref={ref} className="sports-section">
      <div className="container-fluid sports-container">

        <div className="row g-0 row-1">
          <div className="col-4 grid-item hover-text" onClick={triggerShake}>
          <p className="sport-text">揪一波打起來</p>
          </div>
          
        {/* 標題 */}
          <div className="col-4 grid-item title-box hover-text" onClick={triggerShake}>
            <p className=" sport-text">打球啦</p>
            <h2 className="sports-title ">選擇球類</h2>
          </div>

          <div className="col-4 grid-item hover-text" onClick={triggerShake}>
          <p className="sport-text">ㄟ咦！<br/>開團啦</p></div>
        </div>

          {/* 選擇球類區域 */}
        <div className="row g-0 row-2" id="sports-middle">
          
          <a
            href={`/activity-list?search=籃球`}
            className={`col-4 grid-item basketball sportSelect ${getSportClass('basketball')}`}
            onClick={() => handleSportClick('basketball')}
          >
            <div className="sports-icon icon-Basketball" ref={el => (iconRefs.current[0] = el)}></div>
            <p className="sports-text">前往報團</p>
          </a>

          <a
            href={`/activity-list?search=排球`}
            className={`col-4 grid-item volleyball sportSelect ${getSportClass('volleyball')}`}
            onClick={() => handleSportClick('volleyball')}
          >
            <div className="sports-icon icon-Volleyball" ref={el => (iconRefs.current[1] = el)}></div>
            <p className="sports-text">前往報團</p>
          </a>
          <a
            href={`/activity-list?search=羽球`}
            className={`col-4 grid-item badminton sportSelect ${getSportClass('badminton')}`}
            onClick={() => handleSportClick('badminton')}
          >
            <div className="sports-icon icon-Badminton" ref={el => (iconRefs.current[2] = el)}></div>
            <p className="sports-text">前往報團</p>
          </a>
        </div>

        <div className="row g-0 row-3">
          <div className="col-4 grid-item hover-text" onClick={triggerShake}>
          <p className="sport-text">都不揪</p>
          </div>
          <div className="col-4 grid-item hover-text" onClick={triggerShake}>
          <p className="sport-text">發球啦！</p>
          </div>
          <div className="col-4 grid-item hover-text" onClick={triggerShake}>
          <p className="sport-text">play +1</p>
        </div>
      </div>
       </div>
    </section>
   
  );
});

SportsSelection.displayName = "SportsSelection";

export default SportsSelection;
{/*揪一波打起來ㄟ咦！<br/>開團啦 發球啦！都不揪 play +1*/}
