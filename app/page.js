"use client"

import React, { useRef, useEffect, useState } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SportsSelection from "@/components/SportsSelection";
import ActivityList from "@/components/ActivityList";
import ShopSection from "@/components/ShopSection";
import ScrollSection from "@/components/ScrollSection";
import Footer from "@/components/Footer";
import gsap from "gsap";
import MotionPathPlugin from "gsap/MotionPathPlugin";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 引入樣式
import "@/public/TeamB_Icon/style.css";
import {MB_CONTACT_POST} from "../config/auth.api";
import FloatingBallEffect from "@/components/FloatingBallEffect";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Game from "@/components/Game";
import { useAuth } from "../context/auth-context";

gsap.registerPlugin(MotionPathPlugin);

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState("");  // 用來顯示提交狀態
  const headerRef = useRef(null);
  const sportsRef = useRef(null);
  const heroRef = useRef(null);
  const { auth } = useAuth();


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 向後端發送表單資料
    fetch(MB_CONTACT_POST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "表單已成功提交") {
          setSubmitStatus("您的訊息已成功送出！");
          toast.success( <div>
            {"表單提交成功"}<br />
            {"將會有專人與您聯繫！"}<br />
            {"感謝您的提交。"}
            </div>,
  {
    autoClose: 5000, 
  }
);
          
          // 1秒後跳轉回首頁
          setTimeout(() => {
            window.location.href = "/";  // 回到首頁
          }, 1500);  // 延遲 1.5 秒
        } else {
          setSubmitStatus("提交失敗，請再試一次！");
          toast.error("提交失敗，請再試一次！");  // 顯示錯誤通知
        }
      })
      .catch((error) => {
        console.error("錯誤:", error);
        setSubmitStatus("發生錯誤，請稍後再試！");
        toast.error("發生錯誤，請稍後再試！");  // 顯示錯誤通知
      });
  };

  useEffect(() => {
    // slogan區塊與聯繫我們動畫設定
    const container = document.querySelector(".scroll-container");
    const item3 = document.getElementById("item3");

    let isCentered = false;

    if (container && item3) {
      container.addEventListener(
        "wheel",
        function (event) {
          if (event.deltaY !== 0) {
            event.preventDefault();

            const item3Rect = item3.getBoundingClientRect();
            const item3CenterX = item3Rect.left + item3Rect.width / 2;
            const screenCenterX = window.innerWidth / 2;

            if (!isCentered && Math.abs(item3CenterX - screenCenterX) < 100) {
              isCentered = true;
              item3.scrollIntoView({ behavior: "smooth", inline: "center" });

              setTimeout(() => {
                const contactSection = document.getElementById("contact-section");
                contactSection?.scrollIntoView({ behavior: "smooth" });
              }, 1500);
            } else {
              container.scrollBy({
                left: event.deltaY * 1.5,
                behavior: "smooth",
              });
            }
          }
        },
        { passive: false }
      );
    }

    // GSAP 動畫
    let tl = gsap.timeline();
    gsap.registerPlugin(MotionPathPlugin);
    const headerEl = document.querySelector(".navbar-hd");
    const sportsEl = document.querySelector(".sports-section");

    // 隱藏 Header 和 球類選單
    gsap.set([".navbar-hd"], { opacity: 0, y: "-100%", position: "absolute", display: "flex" });
    gsap.set([".sports-section"], { opacity: 0, display: "none" });
    // 隱藏文字初始狀態
    gsap.set([".hero-logo", ".hero-title", ".hero-subtitle", ".hero-highlight", ".hero-scroll"], { opacity: 0 });

    // 設定 section 為地板背景（原始綠色）
    let heroSection = document.querySelector(".hero-container");
    if (heroSection) {
      heroSection.style.background = "linear-gradient(to top, #29755D 0%, #528F7C 100%)"; // 原始綠色背景
      heroSection.style.position = "relative";
      heroSection.style.overflow = "hidden";
    }

    // 初始 Hero 進場動畫
    tl.from(".hero-container", { duration: 1, opacity: 0 })
      .from(".hero-content", { duration: 1.2, opacity: 0, scale: 0.95, ease: "power2.out" })
      .from(".hero-divider", { duration: 1, scaleY: 0, transformOrigin: "center", ease: "power2.out" }, "-=0.5")
      .from([".hero-left", ".hero-right"], { duration: 1.2, opacity: 0, x: [80, -80], ease: "power2.out" }, "-=0.5")
      .add(() => {
        if (window.innerWidth <= 768) {
          // ✅ 手機版只顯示文字動畫，不顯示球動畫
          gsap.to(".hero-logo", { duration: 1, opacity: 1, scale: 1, ease: "back.out(1.7)" });
          gsap.to(".hero-title", { duration: 1, opacity: 1, y: 0, ease: "power2.out", delay: 0.5 });
          gsap.to(".hero-subtitle", { duration: 1, opacity: 1, y: 0, ease: "power2.out", delay: 1 });
          gsap.to([".hero-highlight", ".hero-scroll"], {
            duration: 1,
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "back.out(1.7)",
            delay: 2
          });
          gsap.to(".hero-container", { duration: 0.5, opacity: 0, display: "none", delay: 3.6 });
          gsap.to(sportsEl, { duration: 1, opacity: 1, display: "flex", delay: 3.6 });
          gsap.to(headerEl, {
            duration: 1.5,
            opacity: 1,
            y: "0%",
            position: "fixed",
            ease: "power2.out",
            delay: 3.7
          });
          return;
        }
        // 新增球的動畫與陰影
        let ballContainer = document.createElement("div");
        ballContainer.style.position = "absolute";
        ballContainer.style.top = "50%";
        ballContainer.style.left = "50%";
        ballContainer.style.transform = "translate(-50%, -50%)";
        heroSection.appendChild(ballContainer);

        let ball = document.createElement("div");
        ball.classList.add("animation-ball");
        ball.style.width = "20px";
        ball.style.height = "20px";
        ball.style.backgroundColor = "orange";
        ball.style.borderRadius = "50%";
        ball.style.position = "relative";
        ball.style.boxShadow = " 0px -4px 4px rgba(0, 0, 0, 0.25) inset ";

        let shadow = document.createElement("div");
        shadow.classList.add("ball-shadow");
        shadow.style.width = "30px";
        shadow.style.height = "15px";
        shadow.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        shadow.style.borderRadius = "50%";
        shadow.style.position = "absolute";
        shadow.style.bottom = "-20px";
        shadow.style.left = "50%";
        shadow.style.transform = "translateX(-50%)";
        shadow.style.filter = "blur(8px)";

        ballContainer.appendChild(shadow);
        ballContainer.appendChild(ball);

        gsap.set(ballContainer, { position: "absolute", top: "50%", left: "50%" });

        let ballTimeline = gsap.timeline();

        function bounceShadow(opacity) {
          gsap.to(shadow, { duration: 0.3, opacity: opacity });
        }

        // 球彈跳進場
        ballTimeline.to(ballContainer, { duration: 0.6, y: -50, ease: "power1.out", repeat: 1, yoyo: true, onUpdate: () => bounceShadow(0.3), onComplete: () => bounceShadow(0.9) })
          .to(ballContainer, { duration: 0.9, motionPath: { path: "M0,0 C-200,-180 -310,-90 -350,0" }, ease: "power2.inOut" }, "-=0.05")
          .to(ballContainer, { duration: 0.3, y: -100, repeat: 1, yoyo: true, ease: "power1.out", onUpdate: () => bounceShadow(0.3), onComplete: () => bounceShadow(0.9) }, "-=0.05")
          .add(() => gsap.to(".hero-logo", { duration: 0.6, opacity: 1, scale: 1, ease: "back.out(1.7)" }), "-=0.2")

          // 第二段
          .to(ballContainer, { duration: 0.75, motionPath: { path: "M-350,0 C-260,-140 100,-220 330,-100" }, ease: "power2.inOut" }, "-=0.1")
          .to(ballContainer, { duration: 0.3, y: -200, repeat: 1, yoyo: true, ease: "power1.out", onUpdate: () => bounceShadow(0.3), onComplete: () => bounceShadow(0.9) }, "-=0.05")
          .add(() => {
            gsap.to(".hero-title", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
            gsap.to(".hero-subtitle", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
          }, "-=0.2")

          // 第三段
          .to(ballContainer, { duration: 0.8, motionPath: { path: "M330,-100 C500,-150 470,20 350,160" }, ease: "power2.inOut" }, "-=0.1")
          .to(ballContainer, { duration: 0.3, y: 60, repeat: 1, yoyo: true, ease: "power1.out", onUpdate: () => bounceShadow(0.3), onComplete: () => bounceShadow(0.9) }, "-=0.05")
          .add(() => {
            gsap.to(".hero-highlight", { duration: 0.6, opacity: 1, scale: 1, ease: "back.out(1.7)" });
            gsap.to(".hero-scroll", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
          }, "-=0.2")

        // 最後讓球飛出場外並消失
        ballTimeline.to(ballContainer, {
          duration: 1.2,
          motionPath: {
            path: "M350,160 C500,200 750,-50 950,-350" // 讓曲線更流暢
          },
          ease: "power3.in", // 讓離開畫面有更自然的加速
          scale: 0.6, // 逐漸縮小
          opacity: 0 // 逐漸消失
        });
        // 動畫結束後等 7 秒才隱藏 Hero
        tl.to(".hero-container", { duration: 1, opacity: 0, display: "none" }, "+=7")
          .to(sportsEl, { duration: 1, opacity: 1, display: "flex" }, "+=0") // **Hero 隱藏後馬上顯示球類選單**
          .to(headerEl, { duration: 1.5, opacity: 1, y: "0%", position: "fixed", ease: "power2.out" }, "+=1") // **Header 以滑入方式出現**
          .to(sportsEl, { duration: 1, marginTop: "130px", ease: "power2.out" }, "-=1.3"); // **同步 Header 出現時，讓球類選單下移**
      });
  }, []);

  return (
    <>
      <Header ref={headerRef} />
      <Navbar />
      <HeroSection ref={heroRef} />
      <SportsSelection ref={sportsRef} />
      <ActivityList />
      <ShopSection />
      <ScrollSection />
      <section id="contact-section" className="contact-item">
        <div className="contact-container">
          <div className="contact-left">
            <h2 className="contact-title">TeamB</h2>
            <p className="contact-subtitle">聯繫我們</p>
          </div>
          <div className="contact-right">
   
<div style={{ width: "60%", display: "flex", justifyContent: "flex-start" }}>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "1rem",
      marginTop: "-1rem",
      fontSize: "14px",
      color: "#fff",
      fontWeight: 500,
    }}
  >
    <input
      type="checkbox"
      id="useMember"
      style={{
        width: "18px",
        height: "18px",
        accentColor: "#fff",
        cursor: "pointer",
      }}
      onChange={(e) => {
        if (e.target.checked) {
          setFormData((prev) => ({
            ...prev,
            name: auth.name || "",
            email: auth.email || "",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            name: "",
            email: "",
          }));
        }
      }}
    />
    <label htmlFor="useMember" style={{ cursor: "pointer" }}>
      使用會員資料自動填入
    </label>
  </div>
</div>


          <form className="contact-form" onSubmit={handleSubmit}>

  <label htmlFor="name">姓名</label>
  <input
    type="text"
    id="name"
    placeholder="請輸入姓名"
    value={formData.name}
    onChange={handleChange}
    required
  />

  <label htmlFor="email">電子郵件</label>
  <input
    type="email"
    id="email"
    placeholder="請輸入電子郵件"
    value={formData.email}
    onChange={handleChange}
    required
  />

  <label htmlFor="message">意見回饋</label>
  <textarea
    id="message"
    placeholder="字數須小於200"
    value={formData.message}
    onChange={handleChange}
    maxLength="200"
    required
  ></textarea>

  <button type="submit">送出</button>
</form>

            <ToastContainer />  {/* 吐司通知容器 */}
          </div>
        </div>
      </section>
      <Footer />
      <FloatingBallEffect />
<ScrollToTopButton />
<Game />
    </>
  );
};

export default HomePage;
