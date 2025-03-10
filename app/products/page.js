"use client";
import React from "react";
import Link from "next/link";

export default function ProductsPage() {
  // 不要直接使用前端的功能, 應該在 useEffect() 裡使用
  // console.log('ProductsPage', location.href);

  return (
    <div>
      <h1>產品頁</h1>
      <p>
        <Link href="/products/12?name=產品一">/products/12?name=產品一</Link>
      </p>
      <p>
        <Link href="/products/15?name=產品A">/products/15?name=產品A</Link>
      </p>
      <p>
        <Link href="/products/18?name=產品8">/products/18?name=產品8</Link>
      </p>
    </div>
  );
}
