"use client"

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import Swal from 'sweetalert2';
import "@/app/game-volleyball/game-volleyball.css";

export default function VolleyballGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [balls, setBalls] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [started, setStarted] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameOver(true);
    }
  }, [timeLeft, started]);

  useEffect(() => {
    if (!started || gameOver) return;
    const spawn = setInterval(() => {
      const id = Date.now();
      const top = Math.random() * 30 + 20;
      const left = 110;
      const finalLeft = Math.random() * 20 + 0;
      const finalTop = Math.random() * 40 + 20;
      setBalls((prev) => {
        if (prev.length >= 3) return prev;
        return [...prev, { id, top, left, finalTop, finalLeft, clicked: false }];
      });
    }, 900);
    return () => clearInterval(spawn);
  }, [started, gameOver]);

  useEffect(() => {
    if (gameOver) {
      const prevScores = JSON.parse(localStorage.getItem('volleyballHighScores') || '[]');
      const newScores = [...prevScores, score].sort((a, b) => b - a).slice(0, 5);
      localStorage.setItem('volleyballHighScores', JSON.stringify(newScores));

      Swal.fire({
        title: `⏱️ 時間到！你得了 ${score} 分`,
        html: `
          <h3>🏆 前 5 高分排行榜：</h3>
          <ol style="text-align: left;">
            ${newScores.map((s, i) => `<li>第 ${i + 1} 名：${s + 3} 分</li>`).join('')}
          </ol>`,
        confirmButtonText: '再玩一次',
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

  const handleClickBall = (id) => {
    if (gameOver || !started) return;
    setScore((prev) => prev + 1);
    const el = document.getElementById(`ball-${id}`);
    if (el) {
      const dropTop = 90;
      const dropLeft = Math.random() * 30 + 60;
      // 殺球效果
      gsap.to(el, {
        top: `${dropTop}%`,
        left: `${dropLeft}%`,
        scale: 0.8,
        duration: 0.5,
        ease: 'power2.in',
        onComplete: () => {
          // 沒有打到會消失不見
          setBalls((prev) => prev.filter((b) => b.id !== id));
        }
      });
    }
    setBalls((prev) => prev.map((ball) => ball.id === id ? { ...ball, clicked: true } : ball));
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
          <h2><span><img src="/assets/volleyball.png" className="titleBall" /></span> 我是重砲手</h2>
          <h5>遊戲規則</h5>
          <h6>點擊對方發過來的球即可殺球, 在時間內殺球得分越多者獲勝</h6>
          <button className="start-button" onClick={() => setShowStart(false)}>開始遊戲</button>
        </div>
      )}
      <h1 className="title"><span><img src="/assets/volleyball.png" className="titleBall" /></span> 我是重砲手</h1>
      <div className="info">
        {!started && !showStart && countdown > 0
          ? `🎯 遊戲即將開始：${countdown}`
          : started
          ? `分數：${score} ｜ 剩餘時間：${timeLeft} 秒`
          : ''}
      </div>

      <img src="/assets/net.png" className="net" alt="Net" />

      {balls.map((ball) => (
        <img
          key={ball.id}
          id={`ball-${ball.id}`}
          src="/assets/volleyball.png"
          alt="Volleyball"
          className="ball"
          style={{
            top: `${ball.top}%`,
            left: `${ball.left}%`,
            position: 'absolute',
            transition: 'none'
          }}
          onClick={() => handleClickBall(ball.id)}
          onLoad={(e) => {
            if (!ball.clicked) {
              const el = e.currentTarget;
          
              gsap.to(el, {
                left: `${ball.finalLeft}%`,
                top: `${ball.finalTop}%`,
                duration: 6.0, // 整體飛行時間
                ease: "power3.inOut", // 自然漸慢曲線
                onComplete: () => {
                  setTimeout(() => {
                    setBalls((prev) => prev.filter((b) => b.id !== ball.id));
                  }, 100);
                }
              });
            }
          }}
        />
      ))}
    </div>
  );
}
