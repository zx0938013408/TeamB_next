// import { AuthContextProvider } from "@/contexts/auth-context";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function ALRootLayout({ children }) {
  return (
    <>
      <Header />
      <div className="mainContainer">
        <div className="content">{children}</div>
      </div>
      <Footer />
    </>
  );
}
