"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Header.module.css";
import Navbar from "./Navbar"; // 引入 Navbar 組件
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";

const Header = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);

  // 🔹 點擊外部時關閉搜尋框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <>
      <header className={styles.navbarHd}>
        <div className={styles.navbarContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="/">
              <Image src={Logo} alt="TeamB Logo" priority />
            </Link>
          </div>

          {/* 搜尋、購物車、登入按鈕 */}
          <div className={styles.navbarActions}>
            {/* 搜尋按鈕 */}
            <div 
              className={styles.searchToggle} 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <span className={`icon-Search ${styles.iconSearch}`}></span>
            </div>

            {/* 🔹 搜尋欄 (點擊放大鏡才顯示) */}
            <div 
              ref={searchRef}
              className={`${styles.searchContainer} ${isSearchOpen ? styles.active : ""}`}
            >
              <input type="text" placeholder="搜尋關鍵字" className={styles.searchInput} />
            </div>

            <Link href="#"><span className={`icon-Cart ${styles.iconCart}`}></span></Link>
            <Link href="#"><span className={`icon-User ${styles.iconUser}`}></span></Link>
            <Link href="/activity-create">
            <button className={styles.quickActionBtn}>快速開團</button>
            </Link>
          </div>

          {/* Navbar 開關按鈕 */}
          <div className={styles.navbarToggle}>
            <button
              className={styles.toggleBtn}
              onClick={() => setIsNavbarOpen((prev) => !prev)}
              aria-expanded={isNavbarOpen}
            >
              <span className="icon-Dropdown"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Navbar 組件 (傳入狀態控制) */}
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />
    </>
  );
};

export default Header;
