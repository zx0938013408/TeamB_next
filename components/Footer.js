import styles from "@/styles/Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";


const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      {/* 中間分隔線 */}
      <div className={styles.footerDivider}>
        <div className={styles.line}></div>
        <div className={styles.footerLogo}><Image src={Logo} alt="TeamB Logo" /></div>
        <div className={styles.line}></div>
      </div>

      {/* 主要連結區 */}
      <div className={styles.footerLinks}>
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>活動列表</div>
          <Link href="/activity-list" className={styles.footerLink}>活動列表</Link>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>商城</div>
          <Link href="../../shop/top" className={styles.footerLink}>上衣</Link>
          <Link href="../../shop/bottom" className={styles.footerLink}>褲裝</Link>
          <Link href="../../shop/shoes" className={styles.footerLink}>鞋類</Link>
          <Link href="../../shop/accessory" className={styles.footerLink}>運動裝備</Link>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>關於 TeamB</div>
          <Link href="#" className={styles.footerLink}>品牌故事</Link>
          <Link href="#" className={styles.footerLink}>聯繫我們</Link>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>會員資訊</div>
          <Link href="#" className={styles.footerLink}>我的活動</Link>
          <Link href="#" className={styles.footerLink}>訂單紀錄</Link>
          <Link href="#" className={styles.footerLink}>我的帳戶</Link>
        </div>
      </div>

      {/* 版權資訊 & 社群連結 */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>Copyright © 2025 TeamB. All rights reserved.</div>
        <div className={styles.socialIcons}>
          <Link href="#"><span className={`icon-Mail ${styles.iconMail}`}></span></Link>
          <Link href="#"><span className={`icon-Fb ${styles.iconFb}`}></span></Link>
          <Link href="#"><span className={`icon-Ig ${styles.iconIg}`}></span></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
