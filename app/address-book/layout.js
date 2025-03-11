import React from "react";
import ABNavbar from "@/components/layouts/navbar";

export default function ABRootLayout({ children }) {
  return (
    <>
      <ABNavbar />
      <div className="container">{children}</div>
    </>
  );
}
