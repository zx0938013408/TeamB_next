"use client";
// import Header from "@/components/Header.js"; 
// import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
// import "@/public/TeamB_Icon/style.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";  // 引入 ToastContainer
import "react-toastify/dist/ReactToastify.css";  // 引入 Toastify 的 CSS
import styles from "../../styles/auth/toast.module.css"

export default function AuthLayout({ children }) {
  return (
    <>
      <main className="container mt-4" style={{paddingTop:'150px'}}>
        {children}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        className={styles.toastContainer}
      />
      <Footer />
    </>
  );
}
