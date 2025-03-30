"use client"

import React, { useRef, useEffect } from "react";
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
import "@/public/TeamB_Icon/style.css";

gsap.registerPlugin(MotionPathPlugin);

const HomePage = () => {
  const headerRef = useRef(null);
  const sportsRef = useRef(null);
  const heroRef = useRef(null);


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
    gsap.registerPlugin(MotionPathPlugin);
    // ✅ 使用 useRef 控制動畫目標
    const headerEl = headerRef.current;
    const sportsEl = sportsRef.current;
    const heroSection = heroRef.current;

    if (!headerEl || !sportsEl || !heroSection) return;

    // 動畫前置設定
    gsap.set(headerEl, { opacity: 0, y: "-100%", position: "absolute", display: "flex" });
    gsap.set(sportsEl, { opacity: 0, display: "none" });
    gsap.set([".hero-logo", ".hero-title", ".hero-subtitle", ".hero-highlight", ".hero-scroll"], { opacity: 0 });

    // ✅ Hero 背景樣式
    heroSection.style.background = "linear-gradient(to top, #29755D 0%, #528F7C 100%)";
    heroSection.style.position = "relative";
    heroSection.style.overflow = "hidden";

    // 初始 Hero 進場動畫
    const tl = gsap.timeline();
    tl.from(".hero-container", { duration: 1, opacity: 0 })
        .from(".hero-content", { duration: 1.2, opacity: 0, scale: 0.95, ease: "power2.out" })
        .from(".hero-divider", { duration: 1, scaleY: 0, transformOrigin: "center", ease: "power2.out" }, "-=0.5")
        .from([".hero-left", ".hero-right"], { duration: 1.2, opacity: 0, x: [80, -80], ease: "power2.out" }, "-=0.5")
        .add(() => {
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
      </section>
      <Footer />
    </>
  );
};

export default HomePage;
