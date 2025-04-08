'use client';
import { useRef, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import styles from "./ScratchCard.module.css";
import { SCRATCH_COUPON } from "@/config/coupons-api-path";
import { useAuth } from '@/context/auth-context';

const isSafari = typeof window !== 'undefined' &&
  /Safari/i.test(navigator.userAgent) &&
  !/Chrome/i.test(navigator.userAgent);

const ScratchCard = () => {
  const { auth } = useAuth(); 

  const canvasRef = useRef(null);
  const coverContainerRef = useRef(null);
  const imageRef = useRef(null);
  const timeoutRef = useRef(null);
  const [isScratched, setIsScratched] = useState(false);
  const [message, setMessage] = useState("刮開查看獎品！");
  const [prizeImage, setPrizeImage] = useState("");
  const [revealedPrize, setRevealedPrize] = useState(null);

  const prizes = [
    { id: 1, message: "🎉 恭喜獲得$50折價券 !", image: "/photo/coupon1.png", amount: 50 },
    { id: 2, message: "🎉 恭喜獲得$100折價券 !", image: "/photo/coupon2.png", amount: 100 },
    { id: 3, message: "🎉 恭喜獲得$150折價券 !", image: "/photo/coupon3.png", amount: 150 },
    { id: 4, message: "🎉 恭喜獲得$200折價券 !", image: "/photo/coupon4.png", amount: 200 }
  ];

  const getRandomPrize = () => {
    const randomIndex = Math.floor(Math.random() * prizes.length);
    return prizes[randomIndex];
  };

  const saveCouponToBackend = async (userId, couponId) => {
    try {
      console.log("🔍 儲存優惠券 userId:", userId, "couponId:", couponId);
      const response = await fetch(SCRATCH_COUPON, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, couponId }),
      });

      const result = await response.json();
      console.log("📦 儲存回應結果:", result);

      if (result.success) {
        console.log("✅ 優惠券成功儲存");
      } else {
        console.error("❌ 儲存優惠券失敗", result.error);
      }
    } catch (error) {
      console.error("💥 儲存優惠券時發生錯誤: ", error);
    }
  };

  useEffect(() => {
    const prize = getRandomPrize();
    setRevealedPrize(prize);
    setPrizeImage(prize.image);
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
    if (isScratched && revealedPrize && auth?.id) {
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

      saveCouponToBackend(auth.id, revealedPrize.id);
    }
  }, [isScratched, revealedPrize, auth?.id]); // 加上 auth.id 作為依賴

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


