"use client"

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(MotionPathPlugin);
import Swal from 'sweetalert2';
import "@/app/game-basketball/game-basketball.css"

export default function Home() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // 預設遊戲玩30秒
  const [gameOver, setGameOver] = useState(false);
  const [balls, setBalls] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const containerRef = useRef(null);
  const hoopRef = useRef(null);

  const hoopX = 75;
  const hoopY = 30;

  // 設計倒數計時 
  useEffect(() => {
    if (!started) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, started]);


  // 設定球出現的頻率與玩法
  useEffect(() => {
    if (!started || gameOver) return;
    const spawn = setInterval(() => {
      const id = Date.now();
      const top = Math.random() * 30 + 20;
      const left = Math.random() * 40 + 10;
      setBalls((prev) => [...prev, { id, top, left, clicked: false }]);

      setTimeout(() => {
        setBalls((prev) => prev.filter((ball) => ball.id !== id || ball.clicked));
      }, 1500);
    }, 1200);
    return () => clearInterval(spawn);
  }, [started, gameOver]);

  // 遊戲結算
  useEffect(() => {
    if (gameOver) {
      const prevScores = JSON.parse(localStorage.getItem('highScores') || '[]');
      const newScores = [...prevScores, score].sort((a, b) => b - a).slice(0, 5);
      localStorage.setItem('highScores', JSON.stringify(newScores));

      Swal.fire({
        title: `⏱️ 時間到！你得了 ${score} 分`,
        html: `
          <h3>🏆 前 5 高分排行榜：</h3>
          <ol style="text-align: left;">
            ${newScores.map((s, i) => `<li>第 ${i + 1} 名：${s} 分</li>`).join('')}
          </ol>`,
        confirmButtonText: '再玩一次',
        confirmButtonColor: "#29755D", // 修改按鈕顏色
        cancelButtonText: '回到首頁',
        showCancelButton: true,
        backdrop: true,
        allowOutsideClick: false // 禁止點擊空白區關閉
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        } else {
          window.location.href = '/';
        }
      });
    }
  }, [gameOver, score]);
  
  // 遊戲倒數開始
  useEffect(() => {
    if (showStart) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showStart]);

  // 球投籃軌跡
  const handleClickBall = (id) => {
    if (gameOver || !started) return;
    setScore((prev) => prev + 1);
    const el = document.getElementById(`ball-${id}`);
    const ball = balls.find((b) => b.id === id);
    if (el && ball) {
      const startRect = el.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      const startX = startRect.left - containerRect.left;
      const startY = startRect.top - containerRect.top;
      const endX = (hoopX / 100) * containerRect.width;
      const endY = (hoopY / 100) * containerRect.height;

      const midX = (endX - startX) / 2;
      const arcHeight = Math.min(containerRect.height * 0.3, 200);

      const path = [
        { x: 0, y: 0 },
        { x: midX * 0.5, y: -arcHeight },
        { x: midX, y: -arcHeight * 1.1 },
        { x: midX * 1.5, y: -arcHeight },
        { x: endX - startX, y: endY - startY }
      ];

      const timeline = gsap.timeline();
      timeline.to(el, {
        duration: 1.2,
        rotation: 360,
        motionPath: {
          path,
          curviness: 1.25,
          autoRotate: true
        },
        opacity: 0,
        ease: 'power2.inOut',
        onComplete: () => {
          const hoop = hoopRef.current;
          if (hoop) {
            gsap.fromTo(hoop, { scale: 1 }, { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.inOut' });
          }
        }
      });
    }
    setBalls((prev) =>
      prev.map((ball) =>
        ball.id === id ? { ...ball, clicked: true } : ball
      )
    );
    setTimeout(() => {
      setBalls((prev) => prev.filter((ball) => ball.id !== id));
      setBalls((prev) => {
        const filtered = prev.filter((ball) => ball.id !== id);
        if (filtered.length < 3) {
          const newId = Date.now();
          const top = Math.random() * 40 + 10;
          const left = Math.random() * 40 + 10;
          return [...filtered, { id: newId, top, left, clicked: false }];
        } else {
          return filtered;
        }
      });
    }, 1000);
  };

  return (
    <div className="game-container" ref={containerRef}>
      <a 
        href="/"
        className="goBack"
      >
        <Image src="/photo/logo/TeamB-logo-greenYellow.png" alt="TeamB Logo" width={20} height={20} />回首頁
      </a>
      <img 
        src="/photo/logo/TeamB-logo-greenYellow.png"
        alt="TeamB_Logo"
        className="logo"
      />
      {showStart && (
        <div className="start-overlay">
          <h2><span><img src="/assets/basketball.png" className="titleBall" /></span> 教練!我想打籃球</h2>
          <h5>遊戲規則</h5>
          <h6>點擊籃球即可投籃得分, 在時間內得分越多者獲勝</h6>
          <button className="start-button" onClick={() => setShowStart(false)}>開始遊戲</button>
        </div>
      )}
      <h1 className="title"><span><img src="/assets/basketball.png" className="titleBall" /></span> 教練!我想打籃球</h1>
      <div className="info">
        {!started && !showStart && countdown > 0
          ? `遊戲即將開始：${countdown}`
          : started
          ? `分數：${score} ｜ 剩餘時間：${timeLeft} 秒`
          : ''}
      </div>

      <img src="/assets/hoop.png" className="hoop" alt="Hoop" ref={hoopRef} />

      {balls.map((ball) => (
        <img
          key={ball.id}
          id={`ball-${ball.id}`}
          src="/assets/basketball.png"
          alt="Basketball"
          className={`ball${ball.clicked ? ' shoot' : ''}`}
          onClick={() => handleClickBall(ball.id)}
          style={{
            top: `${ball.top}%`,
            left: `${ball.left}%`,
          }}
        />
      ))}
    </div>
  );
}