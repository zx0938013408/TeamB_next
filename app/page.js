"use client"

import React, { useEffect } from "react";
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
  useEffect(() => {
    // 滾動輪播
    const container = document.querySelector(".scroll-container");
    if (container) {
      container.addEventListener("wheel", function (event) {
        if (event.deltaY !== 0) {
          event.preventDefault();
          container.scrollBy({
            left: event.deltaY * 1.5,
            behavior: "smooth"
          });
        }
      }, { passive: false });
    }

    // 搜尋欄位
    const searchContainer = document.querySelector(".search-container");
    const searchToggle = document.getElementById("search-toggle");
    if (searchContainer && searchToggle) {
      searchToggle.addEventListener("click", function () {
        searchContainer.classList.toggle("active");
      });
      document.addEventListener("click", function (event) {
        if (!searchContainer.contains(event.target) && !searchToggle.contains(event.target)) {
          searchContainer.classList.remove("active");
        }
      });
    }

    // header & navbar 按鈕功能
    const toggleNavbarBtn = document.getElementById("toggle-navbar");
    const closeNavbarBtn = document.getElementById("close-navbar");
    const navbarBt = document.querySelector(".navbar-bt");
    if (toggleNavbarBtn && closeNavbarBtn && navbarBt) {
      toggleNavbarBtn.addEventListener("click", function () {
        navbarBt.classList.toggle("active");
      });
      closeNavbarBtn.addEventListener("click", function () {
        navbarBt.classList.remove("active");
      });
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
      <Header />
      <Navbar />
      <HeroSection />
      <SportsSelection />
      <ActivityList />
      <ShopSection />
      <ScrollSection />
      <Footer />
    </>
  );
};

export default HomePage;
