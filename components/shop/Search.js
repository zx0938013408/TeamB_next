"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/shop/search.module.css";

export default function Search() {
  const router = useRouter();
  const searchRef = useRef();
  const [isShow, setIsShow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = searchRef.current.value.trim();
    if (!query) return;

    router.push(`/shop?keyword=${encodeURIComponent(query)}`);
    setIsShow(true);
  };

  const clearSearch = () => {
    router.replace("/shop");
    searchRef.current.value = "";
    setIsShow(false);
  };

  return (
    <>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="search"
              ref={searchRef}
              className={styles.input}
            />
            <button
              type="submit"
              style={{
                border: "none",
                outline: "none",
              }}
            >
              <div className={styles.iconButton}>
                <span className={`icon-Search ${styles.iconSearch}`} />
              </div>
            </button>
          </form>
        </div>
        {isShow ? (
          <div className={styles.clearSearch} onClick={clearSearch}>
            清除搜尋
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
