import styles from "@/styles/Navbar.module.css";
import Link from "next/link";

const Navbar = ({ isOpen, setIsOpen }) => {
  return (
    <nav className={`${styles.navbarBt} ${isOpen ? styles.active : styles.none}`}>
      <div className={styles.navContainer}>
        <div className={styles.navSection}>
          <div className={styles.navTitle}>活動列表</div>
          <Link href="#" className={styles.navLink}>活動列表</Link>
        </div>
        <div className={styles.navSection}>
          <div className={styles.navTitle}>商城</div>
          <Link href="../../shop/top" className={styles.navLink}>上衣</Link>
          <Link href="../../shop/bottom" className={styles.navLink}>褲裝</Link>
          <Link href="../../shop/shoes" className={styles.navLink}>鞋類</Link>
          <Link href="../../shop/accessory" className={styles.navLink}>運動裝備</Link>
        </div>
        <div className={styles.navSection}>
                <div className={styles.navTitle}>關於TeamB</div>
                <Link href="#" className={styles.navLink}>品牌故事</Link>
                <Link href="#" className={styles.navLink}>聯繫我們</Link>
                <Link href="#" className={styles.navLink}>活動列表</Link>
            </div>
            <div className={styles.navSection}>
                <div className={styles.navTitle}>會員資訊</div>
                <Link href="#" className={styles.navLink}>我的活動</Link>
                <Link href="#" className={styles.navLink}>訂單紀錄</Link>
                <Link href="#" className={styles.navLink}>我的帳戶</Link>
            </div>
      </div>
            

      {/* 關閉 Navbar 按鈕 */}
      <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
        <span className={`icon-Dropup ${styles.iconDropup}`}></span>
      </button>
    </nav>
  );
};

export default Navbar;
