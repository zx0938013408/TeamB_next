import styles from "../top/shop_top.module.css";
import "@/public/TeamB_Icon/style.css";
import Carousel from "../components/carousel";
import Card from "../components/card";

export default function TopPage() {
  return (
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
          <Carousel />
          <Card />

          {/* <div className={styles.more}>
            <div className={styles.textBox}>
              <div className={styles.text}>查看更多</div>
              <span className={`icon-Right ${styles.iconRight}`} />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
