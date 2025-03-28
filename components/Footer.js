import styles from "@/styles/Footer.module.css";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";


const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      {/* 中間分隔線 */}
      <div className={styles.footerDivider}>
        <div className={styles.line}></div>
        <div className={styles.footerLogo}><Image src={Logo} alt="TeamB Logo" fill
    style={{ objectFit: "contain" }}/></div>
        <div className={styles.line}></div>
      </div>

      {/* 主要連結區 */}
      <div className={styles.footerLinks}>
        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>活動列表</div>
          <a href="/activity-list" className={styles.footerLink}>活動列表</a>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>商城</div>
          <a href="../../shop/top" className={styles.footerLink}>上衣</a>
          <a href="../../shop/bottom" className={styles.footerLink}>褲裝</a>
          <a href="../../shop/shoes" className={styles.footerLink}>鞋類</a>
          <a href="../../shop/accessory" className={styles.footerLink}>運動裝備</a>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>關於 TeamB</div>
          <a href="#" className={styles.footerLink}>品牌故事</a>
          <a href="#" className={styles.footerLink}>聯繫我們</a>
        </div>

        <div className={styles.footerSection}>
          <div className={styles.footerTitle}>會員資訊</div>
          <a href="#" className={styles.footerLink}>我的活動</a>
          <a href="#" className={styles.footerLink}>訂單紀錄</a>
          <a href="#" className={styles.footerLink}>我的帳戶</a>
        </div>
      </div>

      {/* 版權資訊 & 社群連結 */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>Copyright © 2025 TeamB. All rights reserved.</div>
        <div className={styles.socialIcons}>
          <a href="#"><span className={`icon-Mail ${styles.iconMail}`}></span></a>
          <a href="#"><span className={`icon-Fb ${styles.iconFb}`}></span></a>
          <a href="#"><span className={`icon-Ig ${styles.iconIg}`}></span></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
