import { useState } from "react";
import styles from "@/styles/Header.module.css";
import Navbar from "./Navbar"; // 引入 Navbar 組件
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";
// import '../public/TeamB_Icon/style.css';

const Header = () => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);

  return (
    <>
      <header className={styles.navbarHd}>
        <div className={styles.navbarContent}>
          {/* Logo */}
          <div className={styles.logoContainer}>
            <Link href="#">
              <Image src={Logo} alt="TeamB Logo" />
            </Link>
          </div>

          {/* 搜尋、購物車、登入按鈕 */}
          <div className={styles.navbarActions}>
            <div className={styles.searchToggle}>
              <span className={`icon-Search ${styles.iconSearch}`}></span>
            </div>
            <div className={styles.searchContainer}>
              <input type="text" placeholder="搜尋關鍵字" className={styles.searchInput} />
            </div>
            <Link href="#"><span className={`icon-Cart ${styles.iconCart}`}></span></Link>
            <Link href="#"><span className={`icon-User ${styles.iconUser}`}></span></Link>
            <button className={styles.quickActionBtn}>快速開團</button>
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
