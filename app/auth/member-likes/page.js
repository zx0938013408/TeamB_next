"use client";

import "../../../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/auth-context";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";
import styles from "./member-likes.module.css";
import { AB_ITEM_GET, AVATAR_PATH } from "@/config/shop-api-path";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const MemberLikes = () => {
  const { auth, logout } = useAuth(); // 獲取會員認證資料
  const [user, setUser] = useState(null); // 儲存用戶資料
  const [selectedTab, setSelectedTab] = useState("all"); // 預設顯示的位置
  const [pdLikes, setPdLikes] = useState([]);
  const [product, setProduct] = useState(null);
  const router = useRouter(); // 用於導航

  const tabs = [
    { key: "all", label: "全部收藏" },
    { key: "top", label: "上衣" },
    { key: "bottom", label: "褲子" },
    { key: "shoes", label: "鞋子" },
    { key: "accessories", label: "運動裝備" },
  ];

  const categoryIdMap = {
    top: 1,
    bottom: 2,
    shoes: 3,
    accessories: 4,
  };

  // 根據分類過濾收藏商品
  function filterByCategory(products, selectedTab) {
    if (selectedTab === "all") return products;

    const expectedCategoryId = categoryIdMap[selectedTab];
    return products.filter(
      (product) => product.category_id === expectedCategoryId
    );
  }
  const filteredPdLikes = filterByCategory(pdLikes, selectedTab);

  // 取得單一會員收藏資料
  useEffect(() => {
    const fetchPdLikes = async () => {
      try {
        const res = await fetch(`${AB_ITEM_GET}/member/${auth.id}`);
        const data = await res.json();

        if (data.success) {
          setPdLikes(data.rows);
        }
      } catch (error) {
        console.error("載入收藏失敗：", error);
      }
    };

    if (auth?.id) {
      fetchPdLikes();
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
          <button
            className={styles.menuItemBtn}
            onClick={() => {
              logout();
              toast("會員已登出", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
              });
              router.push("/"); // 登出後導回首頁或登入頁
            }}
          >
            登出
          </button>
        </div>

        {/* 右側內容 */}
        <div className={styles.content}>
          <div className={styles.orderName}>收藏的商品</div>

          {/* 分類 Tabs */}
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

            {/* 收藏清單 */}
            <div className={styles.list}>
              <div>
                {filteredPdLikes.length > 0 ? (
                  [...filteredPdLikes] //要攤開
                    .sort((a, b) => {
                      const dateA = new Date(a.liked_at).getTime();
                      const dateB = new Date(b.liked_at).getTime();
                      // 把無效的日期排到後面
                      if (isNaN(dateA)) return 1;
                      if (isNaN(dateB)) return -1;
                      console.log(
                        `排序比較：${a.id} (${dateA}) vs ${b.id} (${dateB})`
                      );
                      return dateB - dateA;
                    })
                    .map((product) => {
                      console.log("渲染順序：", product.id, product.created_at);
                      console.log(
                        filteredPdLikes.map((p) => ({
                          id: p.id,
                          created_at: p.created_at,
                          liked_at: p.liked_at,
                        }))
                      );

                      return (
                        <Link
                          key={product.id}
                          href={`/shop/${product.id}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <FavoriteItem
                            product={product}
                            onRemove={(productId) =>
                              setPdLikes((prev) =>
                                prev.filter((p) => p.id !== productId)
                              )
                            }
                          />
                        </Link>
                      );
                    })
                ) : (
                  <div className={styles.noLikes}>尚未有收藏</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ✅ 內部元件：FavoriteItem
import ProductLikeButton from "@/components/shop/ProductLikeButton";
const FavoriteItem = ({ product, onRemove }) => {
  const { product_id, product_name, color, price, image } = product;
  const [liked, setLiked] = useState(false);
  return (
    <div className={styles.list}>
      <div className={styles.listCard}>
        <div className={styles.productImageContainer}>
          <img
            src={
              product.image
                ? `${AVATAR_PATH}/${encodeURIComponent(product.image)}`
                : `/photo/iconLogo.png`
            }
            alt={product.product_name}
            className={styles.productImage}
          />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productName}>{product.product_name}</div>
          <div className={styles.productColor}>{product.color}</div>
          <div className={styles.productPrice}>
            NT${(product.price ?? 0).toLocaleString()}
          </div>
          {/* <div className={styles.likedAt}>
            收藏時間：{new Date(product.liked_at).toLocaleString()}
          </div> */}
        </div>
        <ProductLikeButton
          productId={product.id}
          checked={true} // 會員中心裡的一定是收藏過的
          onClick={(liked) => {
            if (!liked) {
              onRemove(product.id); // 💥 讓整張卡片從畫面消失
            }
          }}
        />
      </div>
    </div>
  );
};

export default MemberLikes;
