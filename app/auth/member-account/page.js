"use client"
// import  "../../styles/globals.css"
import Link from "next/link";
import styles from "../../../styles/auth/member-account.module.css";
import Header from "../../../components/Header";
import "@/public/TeamB_Icon/style.css";

const MemberAccount =()=>{
     return (
      <>
      <Header/>
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
        <Link href="#" className={styles.menuItem}>
          我的訂單
        </Link>
        <Link href="#" className={styles.menuItem}>
          收藏商品
        </Link>
      </div>
    
      <div className={styles.mainContent}>
  <div className={styles.title}>帳號管理</div>
  <div className={styles.rightSection}>
    <form className={styles.form}action="process-account.php" method="POST">
      <input
        className={styles.inputBox}
        type="text"
        name="mail"
        placeholder="帳號"
        required=""
      />
      <input
        className={styles.inputBox}
        type="password"
        name="password"
        placeholder="密碼"
        required=""
      />
      
      <div className={styles.confirm}>
        <button type="submit" className={styles.confirmBtn}>
          確認
        </button>
      </div>
    </form>
  </div>
</div>


      </div>
      </>
    );
  };
  
  
      
  export default MemberAccount