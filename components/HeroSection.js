import React from "react";
import "@/styles/index-styles.css";

const HeroSection = React.forwardRef(function HeroSection(_, ref) {
  return (
    <section ref={ref} className="hero-container">
      <div className="hero-content">
        <div className="hero-divider"></div>
        <div className="hero-left">
          <div className="hero-logo">TeamB</div>
        </div>
        <div className="hero-right">
          <div className="hero-text">
            <div className="hero-title">Where passion</div>
            <div className="hero-subtitle">meet the court</div>
          </div>
          <div className="hero-action">
            <div className="hero-highlight">ㄟ!打球啦</div>
            <div className="hero-scroll">前往報團 +1</div>
          </div>
        </div>
      </div>
    </section>
  );
});


export default HeroSection;
