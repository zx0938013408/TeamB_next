"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "@/styles/shop/FilterSidebar.module.css";
import Search from "./Search";
import * as Accordion from "@radix-ui/react-accordion";
// import Slider, { Range } from "rc-slider";
// import "rc-slider/assets/index.css";

// 連結列
const links = [
  { href: "../shop/top", label: "上衣" },
  { href: "../shop/bottom", label: "褲類" },
  { href: "../shop/shoes", label: "鞋類" },
  { href: "../shop/accessory", label: "運動裝備" },
];

export default function FilterSideBar({
  categories = [],
  themes = [],
  sports = [],
  filters,
  setFilters,
  onClear = () => {},
  onSearchDone = () => {},
}) {
  const pathname = usePathname();
  const currentCategoryName = decodeURIComponent(pathname.split("/").pop());

  return (
    <div>
      {/* 搜尋 */}
      <Search onSearchDone={onSearchDone} />

      {/* 連結列 */}
      <div className={styles.quickLinksSection}>
        <div className={styles.title}>快速導覽</div>
        <div className={styles.linkList}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={styles.linkItem}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <Accordion.Root type="multiple" className={styles.accordionRoot}>
        {/* ✅ 精選主題 */}
        <Accordion.Item value="themes" className={styles.accordionItem}>
          <Accordion.Header className={styles.accordionHeader}>
            <Accordion.Trigger className={styles.accordionTrigger}>
              <span className={styles.labelText}>精選主題</span>
              <span className="ml-auto">
                <i className={`icon-Dropdown ${styles.iconClosed}`}></i>
                <i className={`icon-Dropup ${styles.iconOpen}`}></i>
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.accordionContent}>
            <div className={styles.check}>
              {themes.map((theme) => (
                <label key={theme.id} className={styles.label}>
                  <input
                    type="checkbox"
                    checked={filters.themes.includes(theme.id)}
                    onChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        themes: prev.themes.includes(theme.id)
                          ? prev.themes.filter((id) => id !== theme.id)
                          : [...prev.themes, theme.id],
                      }));
                    }}
                  />
                  <span className={styles.checkMark}></span>
                  <span className={styles.subLabelText}>{theme.name}</span>
                </label>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* ✅ 運動類型 */}
        <Accordion.Item value="sports" className={styles.accordionItem}>
          <Accordion.Header className={styles.accordionHeader}>
            <Accordion.Trigger className={styles.accordionTrigger}>
              <span className={styles.labelText}>運動類型</span>
              <span className="ml-auto">
                <i className={`icon-Dropdown ${styles.iconClosed}`}></i>
                <i className={`icon-Dropup ${styles.iconOpen}`}></i>
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.accordionContent}>
            <div className={styles.check}>
              {sports.map((sport) => (
                <label key={sport} className={styles.label}>
                  <input
                    type="checkbox"
                    checked={filters.sports.includes(sport)}
                    onChange={() => {
                      setFilters((prev) => ({
                        ...prev,
                        sports: prev.sports.includes(sport)
                          ? prev.sports.filter((s) => s !== sport)
                          : [...prev.sports, sport],
                      }));
                    }}
                  />
                  <span className={styles.checkMark}></span>
                  <span className={styles.subLabelText}>{sport}</span>
                </label>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>

        {/* ✅ 商品分類（主分類＋子分類） */}
        <div className={styles.title}>商品分類</div>
        {categories.map((cat) => {
          return (
            <Accordion.Item
              key={cat.id}
              value={`cat-${cat.id}`}
              className={styles.accordionItem}
            >
              <Accordion.Header className={styles.accordionHeader}>
                <Accordion.Trigger asChild>
                  <div className={styles.accordionHeaderRow}>
                    <label className={styles.label}>
                      <input
                        type="checkbox"
                        checked={filters.parentCategories.includes(cat.id)}
                        onChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            parentCategories: prev.parentCategories.includes(
                              cat.id
                            )
                              ? prev.parentCategories.filter(
                                  (id) => id !== cat.id
                                )
                              : [...prev.parentCategories, cat.id],
                          }));
                        }}
                      />
                      <span className={styles.checkMark}></span>
                      <span className={styles.labelText}>{cat.name}</span>
                    </label>
                    <div className={styles.iconWrap}>
                      <i className={`icon-Dropdown ${styles.iconClosed}`}></i>
                      <i className={`icon-Dropup ${styles.iconOpen}`}></i>
                    </div>
                  </div>
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Content className={styles.accordionContent}>
                <div className={styles.check}>
                  {cat.subCategories?.map((sub) => (
                    <label key={sub.id} className={styles.label}>
                      <input
                        type="checkbox"
                        checked={filters.subCategories.includes(sub.id)}
                        onChange={() => {
                          setFilters((prev) => ({
                            ...prev,
                            subCategories: prev.subCategories.includes(sub.id)
                              ? prev.subCategories.filter((id) => id !== sub.id)
                              : [...prev.subCategories, sub.id],
                          }));
                        }}
                      />
                      <span className={styles.checkMark}></span>
                      <span className={styles.subLabelText}>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          );
        })}
      </Accordion.Root>

      <div>
        <button onClick={onClear} className={styles.btn}>
          清除篩選
        </button>
      </div>
    </div>
  );
}
