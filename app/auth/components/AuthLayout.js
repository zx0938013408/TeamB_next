import React from "react";
import  styles from "../../../styles/auth/auth.module.css";
// import  "../../../styles/globals.css"

const AuthLayout = ({ title, description, children }) => {
  return (
    <div className={styles.container}>
      {/* 左側區塊 */}
      <div className={styles.leftSection}>
        <h1>{title}</h1>
        <div className={styles.separator}></div>
        <p>{description}</p>
      </div>

      {/* 右側區塊 */}
      <div className={styles.rightSection}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
