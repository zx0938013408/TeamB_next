"use client";

import { useState } from "react";
import ChildA from "@/components/common/child-a";

import React from "react";

export default function RenderTry1Page() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>{count}</h2>
      <div>
        <button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          click
        </button>
      </div>
      <ChildA name="第一個"/>
      <ChildA name={`第二個: ${count}`} />
    </div>
  );
}
