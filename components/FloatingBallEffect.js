// components/FloatingBallEffect.js
"use client";
import { useEffect } from "react";
import gsap from "gsap";

const FloatingBallEffect = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const tag = e.target.tagName.toLowerCase();

      // 避免在互動元素上產生球
      const ignoreTags = ["button", "a", "input", "textarea", "select", "label", "img"];
      if (ignoreTags.includes(tag)) return;

      const ball = document.createElement("div");
      ball.style.width = "20px";
      ball.style.height = "20px";
      ball.style.borderRadius = "50%";
      ball.style.background = "orange";
      ball.style.position = "absolute";
      ball.style.left = `${e.pageX}px`;
      ball.style.top = `${e.pageY}px`;
      ball.style.zIndex = 1000;
      document.body.appendChild(ball);

      gsap.to(ball, {
        y: -120,
        duration: 0.5,
        ease: "power2.out",
        repeat: 1,
        yoyo: true,
        onComplete: () => ball.remove(),
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
};

export default FloatingBallEffect;
