"use client";

import "../../../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import moment from "moment";
import "@/public/TeamB_Icon/style.css";
import styles from "./member-likes.module.css";
import { AB_LIST } from "@/config/shop-api-path";

const MemberLikes = () => {
  const { auth } = useAuth(); // 獲取會員認證資料
  const [user, setUser] = useState(null); // 儲存用戶資料
  const [selectedTab, setSelectedTab] = useState("all"); // 預設顯示
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const tabs = [
    { key: "all", label: "全部收藏" },
    { key: "top", label: "上衣" },
    { key: "bottom", label: "褲子" },
    { key: "shoes", label: "鞋子" },
    { key: "accessories", label: "運動裝備" },
  ];

  // 根據分類過濾收藏商品
  const filteredFavorites = favorites.filter((product) => {
    if (selectedTab === "all") return true;
    if (selectedTab === "onsale") return product.is_discount === 1;
    return product.category === selectedTab;
  });

  const handleRemoveFavorite = async (productId) => {
    try {
      const res = await fetch(`/api/favorites/delete/${productId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (result.success) {
        setFavorites((prev) => prev.filter((p) => p.product_id !== productId));
      }
    } catch (err) {
      console.error("移除收藏失敗：", err);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${AB_LIST}`);
        const data = await res.json();

        if (data.success) {
          const memberId = auth.id;
          const myFavorites = data.rows.filter(
            (fav) => Number(fav.member_id) === Number(memberId)
          );
          setFavorites(myFavorites);
        }
      } catch (error) {
        console.error("載入收藏失敗：", error);
      }
    };

    if (auth?.id) {
      fetchFavorites();
    }
  }, [auth?.id]);

  useEffect(() => {
    if (auth?.id) {
      setUser(auth); // 設置用戶資料
    }
  }, [auth]);

  if (!user) return <p>載入中...</p>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* 側邊欄 */}
        <div className={styles.sidebar}>
          <Link href="/auth/member" className={styles.menuItem}>
            會員中心
          </Link>
          <Link href="/auth/member-edit" className={styles.menuItem}>
            編輯個人檔案
          </Link>
          <Link href="/auth/member-account" className={styles.menuItem}>
            帳號管理
          </Link>
          <Link href="/auth/orderHistory" className={styles.menuItem}>
            我的訂單
          </Link>
          <Link href="/auth/member-likes" className={styles.menuItem}>
            收藏商品
          </Link>
        </div>

        {/* 右側內容 */}
        <div className={styles.content}>
          <div className={styles.orderName}>收藏的商品</div>
          {/* 根據選中的訂單狀態顯示訂單 */}
          <div className={styles.tabContent}>
            <div className={styles.tabContainer}>
              <div className={styles.tabs}>
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    className={selectedTab === tab.key ? styles.activeTab : ""}
                    onClick={() => setSelectedTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.list}>
              <div className={styles.order}>
                {filteredFavorites.length > 0 ? (
                  filteredFavorites.map((product) => (
                    <FavoriteItem
                      key={product.product_id}
                      product={product}
                      onRemove={handleRemoveFavorite}
                    />
                  ))
                ) : (
                  <div className={styles.noOrders}>尚未有收藏</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberLikes;
