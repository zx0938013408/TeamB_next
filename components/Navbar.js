import { useState } from "react";
import styles from "@/styles/Navbar.module.css";
import Link from "next/link";

const sections = [
  {
    title: "活動列表",
    links: [{ label: "活動列表", href: "/activity-list" }],
  },
  {
    title: "商城",
    links: [
      { label: "商城", href: "../../shop/" },
      { label: "上衣", href: "../../shop/top" },
      { label: "褲裝", href: "../../shop/bottom" },
      { label: "鞋類", href: "../../shop/shoes" },
      { label: "運動裝備", href: "../../shop/accessory" },
    ],
  },
  {
    title: "關於TeamB",
    links: [
      { label: "品牌故事", href: "#" },
      { label: "聯繫我們", href: "#" },
      { label: "活動列表", href: "#" },
    ],
  },
  {
    title: "會員資訊",
    links: [
      { label: "我的活動", href: "#" },
      { label: "訂單紀錄", href: "#" },
      { label: "我的帳戶", href: "#" },
    ],
  },
];

const Navbar = ({ isOpen, setIsOpen }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleSection = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <nav className={`${styles.navbarBt} ${isOpen ? styles.active : styles.none}`}>
       <div className={styles.navContainer}>
        {sections.map((section, index) => (
          <div
            className={styles.navSection}
            key={index}
            onMouseLeave={() => {
              if (window.innerWidth <= 768) {
                setOpenIndex(null);
              }
            }}
            onTouchStart={(e) => {
              if (window.innerWidth <= 768 && openIndex === index) {
                const touchTarget = e.target;
                const isInsideTitle = touchTarget.closest(`.${styles.navTitle}`);
                if (!isInsideTitle) {
                  setOpenIndex(null);
                }
              }
            }}
          >
            <div
              className={styles.navTitle}
              onClick={() => toggleSection(index)}
            >
              {section.title}
            </div>
            <div className={`${styles.linkGroup} ${openIndex === index ? styles.show : ""}`}>
              {section.links.map((link, i) => (
                <a href={link.href} key={i} className={styles.navLink}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 關閉按鈕 */}
      {/* <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
        <span className={`icon-Dropup ${styles.iconDropup}`}></span>
      </button> */}
    </nav>
  );
};

export default Navbar;
