import React from "react";
import "@/styles/index-styles.css";

const ScrollSection = () => {
  
  return (
    <section className="scroll-section">
      <div className="scroll-container">
        <div className="scroll-item" id="item1">
          <h2>Play hard, play together</h2>
          <p>透過籃球建立友誼，共同努力，享受比賽的激情！</p>
        </div>
        <div className="scroll-item" id="item2">
          <h2>This is why we play</h2>
          <p>讓我們在球場上，突破極限，體驗熱血沸騰的時刻！</p>
        </div>
        <div className="scroll-item" id="item3">
          <h2>Where passion meets the court</h2>
          <p>TeamB 提供最佳運動場地，讓你盡情發揮！</p>
        </div>
        {/* <div className="scroll-item contact-item" id="item4">
          <div className="contact-container">
            <div className="contact-left">
              <h2 className="contact-title">TeamB</h2>
              <p className="contact-subtitle">聯繫我們</p>
            </div>
            <div className="contact-right">
              <form className="contact-form">
                <label htmlFor="name">姓名</label>
                <input type="text" id="name" placeholder="請輸入姓名" />
                <label htmlFor="email">電子郵件</label>
                <input type="email" id="email" placeholder="請輸入電子郵件" />
                <label htmlFor="message">意見回饋</label>
                <textarea id="message" placeholder="字數須小於200"></textarea>
                <button type="submit">送出</button>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default ScrollSection;
