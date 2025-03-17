import '@/public/TeamB_Icon/style.css';
import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css"; // 載入 Bootstrap
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js"); // 確保 Bootstrap JS 正確載入
  }, []);

  return <Component {...pageProps} />;
}
