import styles from "./product.module.css";
import "../../../public/TeamB_Icon/style.css";
import Carousel from "../../../components/shop/carousel";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProductPage() {
  return (
    <>
      <Header />
      <div className={styles.body}>
        <div className={styles.container}>
          {/* section-a */}
          <div className={styles.aContainer}>
            <div className={styles.leftSection}>
              <div className={styles.mainImage}>
                <img src="/photo/products_pic/top-1.jpg" alt="商品圖片" />
              </div>
              <div className={styles.thumbnailImages}>
                <img src="/photo/products_pic/top-1.jpg" alt="縮略圖1" />
                <img src="/photo/products_pic/top-1.jpg" alt="縮略圖2" />
                <img src="/photo/products_pic/top-1.jpg" alt="縮略圖3" />
              </div>
            </div>
            <div className={styles.rightSection}>
              <div className={styles.productInfo}>
                <div className={styles.productNameSection}>
                  <div className={styles.category}>上衣</div>
                  <div className={styles.productName}>商品名稱</div>
                </div>
                <div>
                  <span className={styles.detailPrice}>NT$</span>
                  <span className={styles.detailPrice}>999,999</span>
                </div>
              </div>
              <div className={styles.productDetail}>
                <select className={styles.sizeSection}>
                  <option className={styles.dropdown}>尺寸</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
                {/* <div className={styles.colorOptions}>
                  <label className={`${styles.colorBtn} ${styles.black}`}>
                    <input type="radio" name="color" defaultValue="black" />
                    <span/>
                  </label>
                  <label className={`${styles.colorBtn} ${styles.white}`}>
                    <input type="radio" name="color" defaultValue="white" />
                    <span/>
                  </label>
                  <label className={`${styles.colorBtn} ${styles.gray}`}>
                    <input type="radio" name="color" defaultValue="gray" />
                    <span/>
                  </label>
                  <label className={`${styles.colorBtn} ${styles.red}`}>
                    <input type="radio" name="color" defaultValue="red" />
                    <span/>
                  </label>
                  <label className={`${styles.colorBtn} ${styles.blue}`}>
                    <input type="radio" name="color" defaultValue="blue" />
                    <span/>
                  </label>
                  <label className={`${styles.colorBtn} ${styles.green}`}>
                    <input type="radio" name="color" defaultValue="green" />
                    <span/>
                  </label>
                </div> */}
                <div className={styles.quantity}>
                  <select className={styles.quantitySection}>
                    <option className={styles.dropdown}>數量</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <div className={styles.stock}>庫存：999 件</div>
                </div>
                <div className={styles.buttons}>
                  <button className={styles.iconButtonLarge} id="toggleBtn">
                    <span
                      className={`icon-Like-Stroke ${styles.iconLikeStroke}`}
                    />
                  </button>
                  <button className={styles.btnPrimary}>加入購物車</button>
                  <button className={styles.btnSecondary}>立即購買</button>
                </div>
              </div>
            </div>
          </div>

          {/* 商品詳情 */}
          <div className={styles.bContainer}>
            <div className={styles.title}>商品詳情</div>
            <div className={styles.bDetailSection}>
              <img src="/photo/products_pic/top-1.jpg" alt="商品詳情圖片" />
              <img src="/photo/products_pic/top-1.jpg" alt="商品詳情圖片" />
              <img src="/photo/products_pic/top-1.jpg" alt="商品詳情圖片" />
            </div>
          </div>

          {/* 大家還看了 */}
          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>大家還看了</div>
            </div>

            {/* TODO:隨機從資料庫抽出八~九個商品來放 */}
            <Carousel categoryId={1} />


            <div className={styles.more}>
              <div>
                {/* <Link href="../shop/top" styles={{ textDecoration: "none" }}>
                  <div className={styles.textBox}>
                    <div className={styles.text}>查看更多</div>
                    <span className={`icon-Right ${styles.iconRight}`} />
                  </div>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
