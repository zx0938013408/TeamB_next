"use client";

import { useState, useRef } from "react";
import ChildA from "@/components/common/child-a";
import ChildB from "@/components/common/child-b";

import React from "react";

export default function RenderTry2Page() {
  const h2Ref = useRef();

  return (
    <div>
      <h2 ref={h2Ref}>12</h2>
      <div>
        <button
          onClick={() => {
            if (h2Ref.current?.innerHTML) {
              console.log(h2Ref.current.innerHTML);
              // 直接變更 DOM, 元件沒有更新
              // h2Ref.current.innerHTML += 1;
              h2Ref.current.innerHTML = +h2Ref.current.innerHTML + 1;
            }
          }}
        >
          click
        </button>
      </div>
      <ChildA name="第一個" />
      <ChildB name="第三個" />
    </div>
  );
}
