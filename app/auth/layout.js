"use client";
// import Header from "@/components/Header.js"; 
// import Navbar from "@/components/Navbar.js";
import Footer from "@/components/Footer.js";
// import "@/public/TeamB_Icon/style.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContextProvider } from "../../context/auth-context.js";





export default function RootLayout({ children }) {
  return (
    <AuthContextProvider>
    <html lang="en">
      <body>

      {/* <Header />
          <Navbar /> */}
          <main className="container mt-4" style={{paddingTop:'150px'}}>{children}</main>
          <Footer/>

      </body>
    </html>
    </AuthContextProvider>
  );
}
