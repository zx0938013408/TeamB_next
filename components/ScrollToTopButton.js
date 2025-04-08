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
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#29755D",
        color: "white",
        fontSize: "24px",
        border: "none",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: "pointer",
        zIndex: 1001,
      }}
      aria-label="Scroll to top"
    >
    <img src="/photo/top-up.png" style={{ width: '75%', display: 'block', margin: '0 auto' }} />
    
    </button>
  );
};

export default ScrollToTopButton;
