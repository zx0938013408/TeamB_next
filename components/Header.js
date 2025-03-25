"use client";

import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Header.module.css";
import Navbar from "./Navbar"; // 引入 Navbar 組件
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";
import { useAuth } from "../context/auth-context"; // 引入 useAuth
import { useRouter } from "next/navigation";

const Header = () => {
  const { auth, logout } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  const handleLogout = () => {
    // 紀錄當前頁面 URL
    localStorage.setItem("lastPageBeforeLogout", router.asPath);

    logout();

    // 顯示登出提示
    alert("會員已登出");
  };

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

  // 🔹 滾動時隱藏 Header 並關閉 Navbar
  useEffect(() => {
    let prevScroll = window.scrollY;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const header = document.querySelector(`.${styles.navbarHd}`);

      if (scrollY > 30) {
        header.classList.add(styles.scrolled);
      } else {
        header.classList.remove(styles.scrolled);
      }

      if (scrollY > prevScroll && scrollY > 100) {
        header.classList.add(styles.hideHeader);
        setIsHidden(true);
      } else {
        header.classList.remove(styles.hideHeader);
        setIsHidden(false);
      }

      // 🔹 滾動時即刻關閉 Navbar
      setIsNavbarOpen(false);

      prevScroll = scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`${styles.navbarHd} ${isHidden ? styles.hideHeader : ""}`}
      >
        <div className={styles.navbarContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="/">
              <Image
                src={Logo}
                alt="TeamB Logo"
                priority
                width={160}
                height={45}
              />
            </Link>
          </div>

          <div
            className={`${styles.navbarActions} ${
              isSearchOpen ? styles.searching : ""
            }`}
          >
            <div className={styles.actionsContainer}>
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
                  className={`${styles.searchContainer} ${
                    isSearchOpen ? styles.active : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder="搜尋關鍵字"
                    className={styles.searchInput}
                  />
                </div>

                <Link href="#">
                  <span className={`icon-Cart ${styles.iconCart}`}></span>
                </Link>
                <span
                  className={`icon-User ${styles.iconUser}`}
                  onClick={() => {
                    if (auth.token) {
                      router.push("/auth/member");
                    } else {
                      router.push("/auth/login");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                ></span>

                {auth.token ? (
                  <button
                    className={styles.quickActionBtn}
                    onClick={handleLogout}
                  >
                    登出
                  </button>
                ) : (
                  <button
                    className={styles.quickActionBtn}
                    onClick={() => (window.location.href = "/auth/login")}
                  >
                    登入
                  </button>
                )}

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
                  <span
                    className={isNavbarOpen ? "icon-Dropup" : "icon-Dropdown"}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar 組件 (傳入狀態控制) */}
      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />
    </>
  );
};

export default Header;
