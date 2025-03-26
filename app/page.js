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

    // 其餘動畫與功能略...

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
