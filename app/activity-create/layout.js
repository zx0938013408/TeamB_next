// import { AuthContextProvider } from "@/contexts/auth-context";
import React from "react";
import Footer from "@/components/Footer";

export default function ActivityCreate({ children }) {
  return (
    <>
      <div style={{ position: "relative", minHeight: "120vh" }}>
        {children}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Footer />
        </div>
      </div>
    </>
  );
}
