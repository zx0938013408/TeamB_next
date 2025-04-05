"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/shop/FilterSidebar.module.css";
import Search from "./Search";
// import Slider, { Range } from "rc-slider";
// import "rc-slider/assets/index.css";

// ✅ 單一篩選按鈕群組
function FilterButtonGroup({ title, options = [], selected, onSelect }) {
  return (
    <div className={styles.Section}>
      <div className={styles.title}>{title}</div>
      <div className={styles.check}>
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.id;
          const label = typeof option === "string" ? option : option.name;
          const isChecked = selected === value;

          return (
            <label key={value} className={styles.label}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onSelect(value)}
              />
              <span className={styles.checkMark}></span>
              {label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

{
  /* 連結列 */
}
const links = [
  { href: "../shop/top", label: "上衣" },
  { href: "../shop/bottom", label: "褲類" },
  { href: "../shop/shoes", label: "鞋類" },
  { href: "../shop/accessory", label: "運動裝備" },
];

export default function FilterSideBar({
  categories = [],
  pdTypes = [],
  themes = [],
  sports = [],
  filters,
  setFilters,
  selectedCategory,
  selectedPdTypes = [],
  selectedThemes = [],
  selectedTheme = null,
  selectedSport = null,
  onCategorySelect = () => {},
  onPdTypeToggle = () => {},
  onThemeSelect = () => {},
  onSportSelect = () => {},
  onClear = () => {},
}) {
  return (
    <div>
      {/* 搜尋 */}
      <Search />

      {/* 連結列 */}
      <div className={styles.categoryList}>
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.text}>
            {link.label}
          </Link>
        ))}
      </div>

      <aside>
        <FilterButtonGroup
          title="商品分類"
          options={categories}
          selected={selectedCategory}
          onSelect={onCategorySelect}
        />{" "}
        <FilterButtonGroup
          title="運動類型"
          options={sports}
          selected={selectedSport}
          onSelect={onSportSelect}
        />

        <FilterButtonGroup
          title="精選主題"
          options={themes}
          selected={selectedTheme}
          onSelect={onThemeSelect}
        />
      </aside>

      <div>
        <button
          onClick={() => {
            onClear(); // 呼叫上層清除邏輯
          }}
          className={styles.btn}
        >
          清除篩選
        </button>
      </div>
    </div>
  );
}
