import styles from "./shop_top.module.css";
import "@/public/TeamB_Icon/style.css";
import Carousel from "../../../components/shop/carousel";
import Card from "../../../components/shop/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TopPage() {
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
              <div className={styles.title}>上衣</div>
            </div>
            <Carousel categoryId={1} />

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
