"use client"
import { useState } from "react";
import styles from "@/styles/Navbar.module.css";
import Link from "next/link";
import Swal from 'sweetalert2'

// 運動許願池
const handleSuggest = async () => {
  const { value: sport, isConfirmed } = await Swal.fire({
    title: '運動許願池',
    text:'未來您希望 TeamB 網站可以新增哪一種球類/運動可以揪團？',
    input: 'text',
    inputPlaceholder: '例如：桌球、棒球、手球…',
    showCancelButton: true,
    confirmButtonText: '送出',
    confirmButtonColor: "#29755D", // 修改按鈕顏色
    cancelButtonText: '取消',
    didClose: () =>{
      document.body.style.overflow = ''
    },
    inputValidator: (value) => {
      if (!value) return '請輸入球類名稱'
    },
  })

  if (isConfirmed && sport) {
    Swal.fire({
      icon: 'success',
      title: '你成功投票！',
      text: `已收到你的建議：${sport}`,
      confirmButtonColor: "#29755D", // 修改按鈕顏色
      didClose: () =>{
        document.body.style.overflow = ''
      },
    })
  }
}

const sections = [
  {
    title: "活動專區",
    links: [
      { label: "活動列表", href: "/activity-list" },
      { label: "手指運動", href: "/sport-game" },
    ],
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
      { label: "運動許願池", onClick: handleSuggest },
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
            {section.links.map((link, i) =>
  link.onClick ? (
    <a key={i} onClick={link.onClick} className={styles.navLink} style={{ cursor: "pointer" }}>
      {link.label}
    </a>
  ) : (
    <a href={link.href} key={i} className={styles.navLink}>
      {link.label}
    </a>
  )
)}
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
