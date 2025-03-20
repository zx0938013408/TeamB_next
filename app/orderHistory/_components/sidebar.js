'use client'
import { useState } from "react";
import '../styles.css'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { href: "member.html", label: "會員中心" },
    { href: "member-edit.html", label: "編輯個人檔案" },
    { href: "member-edit2.html", label: "帳號管理" },
    { href: "#", label: "我的訂單" },
    { href: "#", label: "收藏活動" },
    { href: "#", label: "收藏商品" },
  ];

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "←" : "→"}
      </button>
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        {menuItems.map((item, index) => (
          <a key={index} href={item.href} className="menu-item">
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}