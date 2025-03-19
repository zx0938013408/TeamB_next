import styles from "../category.module.css";
import "@/public/TeamB_Icon/style.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InfiniteCard from "@/components/shop/infinite-card";

export default function BottomPage() {
  return (
    <>
      <Header />
      <div className={styles.body}>
        <div className={styles.container}>
          {/* 搜尋欄 */}
          <div className={styles.search}>
            <span className={`icon-Search ${styles.iconSearch}`} />
          </div>

          <div className={styles.itemsSection}>
            <div className={styles.titleBg}>
              <div className={styles.title}>鞋類</div>
            </div>
            <InfiniteCard categoryId={3}/>

            {/* <div className={styles.more}>
            <div className={styles.textBox}>
              <div className={styles.text}>查看更多</div>
              <span className={`icon-Right ${styles.iconRight}`} />
            </div>
          </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
