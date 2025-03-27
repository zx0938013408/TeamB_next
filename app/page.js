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



    
    // HeroSection GSAP 動畫設定（保留原始動畫）
    let tl = gsap.timeline();
    const headerEl = document.querySelector(".navbar-hd");
    const sportsEl = document.querySelector(".sports-section");

    gsap.set([".navbar-hd"], { opacity: 0, y: "-100%", position: "absolute", display: "flex" });
    gsap.set([".sports-section"], { opacity: 0, display: "none" });
    gsap.set([".hero-logo", ".hero-title", ".hero-subtitle", ".hero-highlight", ".hero-scroll"], { opacity: 0 });

    let heroSection = document.querySelector(".hero-container");
    if (heroSection) {
      heroSection.style.background = "linear-gradient(to top, #29755D 0%, #528F7C 100%)";
      heroSection.style.position = "relative";
      heroSection.style.overflow = "hidden";
    }

    tl.from(".hero-container", { duration: 1, opacity: 0 })
      .from(".hero-content", { duration: 1.2, opacity: 0, scale: 0.95, ease: "power2.out" })
      .from(".hero-divider", { duration: 1, scaleY: 0, transformOrigin: "center", ease: "power2.out" }, "-=0.5")
      .from([".hero-left", ".hero-right"], { duration: 1.2, opacity: 0, x: [80, -80], ease: "power2.out" }, "-=0.5")
      .add(() => {
        gsap.to(".hero-logo", { duration: 0.6, opacity: 1, scale: 1, ease: "back.out(1.7)" });
        gsap.to(".hero-title", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
        gsap.to(".hero-subtitle", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
        gsap.to(".hero-highlight", { duration: 0.6, opacity: 1, scale: 1, ease: "back.out(1.7)" });
        gsap.to(".hero-scroll", { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
      })
      .to(".hero-container", { duration: 1, opacity: 0, display: "none" }, "+=7")
      .to(sportsEl, { duration: 1, opacity: 1, display: "flex" }, "+=0")
      .to(headerEl, { duration: 1.5, opacity: 1, y: "0%", position: "fixed", ease: "power2.out" }, "+=1")
      .to(sportsEl, { duration: 1, marginTop: "130px", ease: "power2.out" }, "-=1.3");

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
