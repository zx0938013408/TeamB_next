import React, { useState } from "react";
import "@/styles/index-styles.css";

const SportsSelection = () => {
  const [selectedSport, setSelectedSport] = useState(null);

  const handleSportClick = (sport) => {
    setSelectedSport(sport);
  };

  const getSportClass = (sport) => {
    return sport === selectedSport ? 'selected' : '';
  };
  return (
    <section className="sports-section">
      <div className="container-fluid sports-container">
        <div className="row g-0 row-1">
          <div className="col-4 grid-item hover-text">
          <p className="sport-text">揪一波打起來</p></div>
          
        {/* 標題 */}
          <div className="col-4 grid-item title-box hover-text">
            <p className=" sport-text">打球啦</p>
            <h2 className="sports-title ">選擇球類</h2>
          </div>

          <div className="col-4 grid-item hover-text">
          <p className="sport-text">ㄟ咦！<br/>開團啦</p></div>
        </div>

          {/* 選擇球類區域 */}
        <div className="row g-0 row-2">
          <div 
            className={`col-4 grid-item basketball ${getSportClass('basketball')}`}
            onClick={() => handleSportClick('basketball')}
          >
            <div className="sports-icon icon-Basketball"></div>
            <p className="sports-text">前往報團</p>
          </div>
          <div 
            className={`col-4 grid-item volleyball ${getSportClass('volleyball')}`}
            onClick={() => handleSportClick('volleyball')}
          >
            <div className="sports-icon icon-Volleyball"></div>
            <p className="sports-text">前往報團</p>
          </div>
          <div 
            className={`col-4 grid-item badminton ${getSportClass('badminton')}`}
            onClick={() => handleSportClick('badminton')}
          >
            <div className="sports-icon icon-Badminton"></div>
            <p className="sports-text">前往報團</p>
          </div>
        </div>

        <div className="row g-0 row-3">
          <div className="col-4 grid-item hover-text">
          <p className="sport-text">都不揪</p></div>
          <div className="col-4 grid-item hover-text">
          <p className="sport-text">發球啦！</p></div>
          <div className="col-4 grid-item hover-text">
          <p className="sport-text">play +1</p></div>
        </div>
      </div>
    </section>
  );
};

export default SportsSelection;
