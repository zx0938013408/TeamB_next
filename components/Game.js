// components/ScrollToTopButton.js
"use client";
import React, { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <a href="/sport-game">
    <button
      style={{
        position: "fixed",
        bottom: "110px",
        right: "40px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#ffb430",
        color: "white",
        fontSize: "24px",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
        zIndex: 1001,
      }}
      aria-label="Scroll to top"
    >
    <img src="/photo/joystick.png" style={{ width: '75%', display: 'block', margin: '0 auto' }} />
    
    </button>
    </a>
  );
};

export default ScrollToTopButton;
