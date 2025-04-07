"use client"

import styles from "@/styles/Footer.module.css";
import Image from "next/image";
import Logo from "../public/src/assets/iconLogo.png";
import Swal from 'sweetalert2'



const Footer = () => {

  // 運動許願池
  const handleSuggest = async () => {
    const { value: sport, isConfirmed } = await Swal.fire({
      title: '運動許願池',
      text:'未來您希望 TeamB 網站可以新增哪一種球類/運動可以揪團？',
      input: 'text',
      inputPlaceholder: '例如：桌球、棒球、手球…',
      showCancelButton: true,
      confirmButtonText: '送出',
      confirmButtonColor: "#29755D", // 修改按鈕顏色
      cancelButtonText: '取消',
      didClose: () =>{
        document.body.style.overflow = ''
      },
      inputValidator: (value) => {
        if (!value) return '請輸入球類名稱'
      },
    })
  
    if (isConfirmed && sport) {
      Swal.fire({
        icon: 'success',
        title: '你成功投票！',
        text: `已收到你的建議：${sport}`,
        confirmButtonColor: "#29755D", // 修改按鈕顏色
        didClose: () =>{
          document.body.style.overflow = ''
        },
      })
    }
  }

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
          <div className={styles.footerTitle}>活動專區</div>
          <a href="/activity-list" className={styles.footerLink}>活動列表</a>
          <a href="/sport-game" className={styles.footerLink}>手指運動</a>
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
          <a href="#" className={styles.footerLink} onClick={handleSuggest}>運動許願池</a>
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
