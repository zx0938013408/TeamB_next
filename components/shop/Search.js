"use client";
import { useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "@/styles/shop/search.module.css";

export default function Search({ onSearchDone = () => {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef();
  const [isShow, setIsShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchRef.current.value.trim();
    if (!query) return;

    router.push(`${pathname}?keyword=${encodeURIComponent(query)}`, { scroll: false });
    setIsShow(true);
    onSearchDone(); //搜尋後滾動
  };

  const clearSearch = () => {
    router.replace(pathname, undefined, { scroll: false });
    searchRef.current.value = "";
    setIsShow(false);
    onSearchDone(); //清除後滾動
  };

  return (
    <>
      <div className={styles.search}>
  <form onSubmit={handleSubmit} className={styles.searchForm}>
    <div className={styles.inputWrapper}>
      <input
        type="text"
        placeholder="買好裝備一起打球吧!"
        ref={searchRef}
        className={styles.input}
      />
      <button type="submit" className={styles.iconButton}>
        <span className={`icon-Search ${styles.iconSearch}`}/>
      </button>
    </div>
  </form>

  {isShow && (
    <div className={styles.clearSearch} onClick={clearSearch}>
      清除搜尋
    </div>
  )}
</div>

    </>
  );
}
