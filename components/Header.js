"use client";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/Header.module.css";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";
import { useAuth } from "../context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationBell from "./NotificationBell";
import { AVATAR_PATH } from "../config/auth.api";
import { useCart } from "@/hooks/use-cart";

const Header = () => {
  const pathname = usePathname();
  const { auth, logout } = useAuth();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const searchRef = useRef(null);
  const avatarRef = useRef(null);
  const notificationRef = useRef(null);
  const router = useRouter();
  const { totalQty } = useCart();

  const handleLogout = () => {
    localStorage.setItem("lastPageBeforeLogout", router.asPath);
    logout();
    toast("會員已登出", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
    });
    if (pathname && pathname.startsWith("/auth/member")) {
      router.push("/");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarRef.current &&
        !avatarRef.current.contains(event.target) &&
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        setIsNotificationOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      setIsNavbarOpen(false);
      prevScroll = scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.navbarHd} ${isHidden ? styles.hideHeader : ""}`}>
        <div className={styles.navbarContent}>
          <div className={styles.logoContainer}>
            <Link href="/">
              <Image src={Logo} alt="TeamB Logo" priority width={160} height={45} />
            </Link>
          </div>

          <div className={`${styles.navbarActions} ${isSearchOpen ? styles.searching : ""}`}>
            <div className={styles.actionsContainer}>
              <div className={styles.navbarActions}>
                <div className={styles.iconCartArea}>
                  <span
                    className={`icon-Cart ${styles.iconCart}`}
                    onClick={() => {
                      if (auth.token) {
                        router.push("/cart");
                      } else {
                        router.push("/auth/login");
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  ></span>
                  {auth.token && totalQty > 0 && (
                    <span className={styles.iconCartNum}>{totalQty}</span>
                  )}
                </div>

                {auth.id !== 0 && (
                  <div ref={notificationRef} className={styles.iconBell}>
                    <NotificationBell
                      memberId={auth.id}
                      onClick={() => {
                        setIsNotificationOpen(!isNotificationOpen);
                        setIsDropdownOpen(false);
                      }}
                      isOpen={isNotificationOpen}
                    />
                  </div>
                )}

                {auth.id != 0 ? (
                  <div ref={avatarRef} className={styles.avatarWrapper}>
                    <img
                      src={
                        auth?.avatar?.startsWith("http")
                          ? auth.avatar
                          : `${AVATAR_PATH}/${auth?.avatar || "imgs/main.png"}`
                      }
                      alt="User Avatar"
                      className={styles.avatarImg}
                      onClick={() => {
                        setIsDropdownOpen(!isDropdownOpen);
                        setIsNotificationOpen(false);
                      }}
                    />
                    {isDropdownOpen && (
                      <ul className={styles.dropdownMenu}>
                        <a href="/auth/member">
                          <li>會員中心</li>
                        </a>
                        <a href="/auth/member-edit">
                          <li>編輯個人檔案</li>
                        </a>
                        <a href="/auth/member-account">
                          <li>帳號管理</li>
                        </a>
                        <a href="/auth/orderHistory">
                          <li>我的訂單</li>
                        </a>
                        <a href="/auth/member-likes">
                          <li>收藏商品</li>
                        </a>
                        <a href="/auth/member-coupon">
                          <li>我的優惠券</li>
                        </a>
                        <li onClick={handleLogout}>登出</li>
                      </ul>
                    )}
                  </div>
                ) : (
                  <button
                    className={styles.quickActionBtn}
                    onClick={() => {
                      localStorage.setItem("lastVisitedPage", window.location.pathname);
                      router.push("/auth/login");
                    }}
                  >
                    登入
                  </button>
                )}

                <Link href="/activity-create">
                  <button className={styles.quickActionBtn}>快速開團</button>
                </Link>
              </div>

              <div className={styles.navbarToggle}>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setIsNavbarOpen((prev) => !prev)}
                  aria-expanded={isNavbarOpen}
                >
                  <span className={isNavbarOpen ? "icon-Dropup" : "icon-Dropdown"}></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <Navbar isOpen={isNavbarOpen} setIsOpen={setIsNavbarOpen} />
    </>
  );
};

export default Header;
