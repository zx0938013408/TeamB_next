'use client';
import React, { useRef, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import styles from "./ScratchCard.module.css";

const isSafari = typeof window !== 'undefined' &&
  /Safari/i.test(navigator.userAgent) &&
  !/Chrome/i.test(navigator.userAgent);

const ScratchCard = () => {
  const canvasRef = useRef(null);
  const coverContainerRef = useRef(null);
  const imageRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [message, setMessage] = useState("刮開查看獎品！");
  const [prizeImage, setPrizeImage] = useState("");
  const [revealedPrize, setRevealedPrize] = useState(null);

  const prizes = [
    { message: "🎉 恭喜獲得$50折價券 !", image: "/photo/coupon1.png" },
    { message: "🎉 恭喜獲得$100折價券 !", image: "/photo/coupon2.png" },
    { message: "🎉 恭喜獲得$150折價券 !", image: "/photo/coupon3.png" },
    { message: "🎉 恭喜獲得$200折價券 !", image: "/photo/coupon4.png" }
  ];

  const getRandomPrize = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  };

  useEffect(() => {
    const prize = getRandomPrize();
    setRevealedPrize(prize);
    setPrizeImage(prize.image); // 圖片先設定，但會被 canvas 擋住
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const devicePixelRatio = window.devicePixelRatio || 1;

    const width = canvas.offsetWidth * devicePixelRatio;
    const height = canvas.offsetHeight * devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    if (isSafari) {
      canvas.classList.add(styles.hidden);
      return;
    }

    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "destination-out";

    let isDrawing = false;
    let lastX, lastY;

    const getPos = ({ clientX, clientY }) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const draw = (e) => {
      if (!isDrawing) return;
      const { x, y } = getPos(e);
      const dist = Math.hypot(x - lastX, y - lastY);
      const steps = dist / 4;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const drawX = lastX + (x - lastX) * t;
        const drawY = lastY + (y - lastY) * t;
        ctx.beginPath();
        ctx.arc(drawX, drawY, 16, 0, Math.PI * 2);
        ctx.fill();
      }
      lastX = x;
      lastY = y;
    };

    const handleDown = (e) => {
      const pos = getPos(e);
      lastX = pos.x;
      lastY = pos.y;
      isDrawing = true;
      canvas.addEventListener("pointermove", draw);
      window.addEventListener("pointerup", handleUp, { once: true });
    };

    const handleUp = () => {
      isDrawing = false;
      canvas.removeEventListener("pointermove", draw);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(checkScratched, 500);
    };

    const checkScratched = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparentPixels = 0;
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
      }
      const totalPixels = canvas.width * canvas.height;
      const cleared = (transparentPixels / totalPixels) * 100;
      if (cleared >= 45) setIsScratched(true);
    };

    canvas.addEventListener("pointerdown", handleDown);

    return () => {
      canvas.removeEventListener("pointerdown", handleDown);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isScratched && revealedPrize) {
      setMessage(revealedPrize.message);

      confetti({
        particleCount: 100,
        spread: 90,
        origin: {
          y: (coverContainerRef.current.getBoundingClientRect().bottom + 60) / window.innerHeight,
        },
        zIndex: 9999,
      });

      imageRef.current?.classList.add(styles.animate);
      coverContainerRef.current?.classList.add(styles.clear);
      coverContainerRef.current?.addEventListener("transitionend", () => {
        coverContainerRef.current?.classList.add(styles.hidden);
      }, { once: true });
    }
  }, [isScratched, revealedPrize]);

  return (
    <div className={styles.container}>
      <div className={styles.scratchCard}>
        {prizeImage && (
          <img
            ref={imageRef}
            src={prizeImage}
            className={styles.scratchCardImage}
            alt="Prize"
          />
        )}
        <div ref={coverContainerRef} className={styles.scratchCardCoverContainer}>
          <canvas ref={canvasRef} className={styles.canvas}></canvas>
        </div>
      </div>
      <div className={styles.scratchCardText}>{message}</div>
    </div>
  );
};

export default ScratchCard;
