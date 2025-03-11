"use client";

import { useState, useRef } from "react";
import ChildA from "@/components/common/child-a";
import ChildB from "@/components/common/child-b";

import React from "react";

export default function RenderTry3Page() {
  const [count, setCount] = useState(0);
  const varRef = useRef();

  return (
    <div>
      <h2>{count}</h2>
      <div>
        <button onClick={() => setCount((prev) => prev + 1)}>click</button>
      </div>

      <div>
        <button
          onClick={() => {
            varRef.current ||= 0;
            varRef.current++;
            console.log(varRef.current);
          }}
        >
          click 2
        </button>
      </div>
      <ChildA name="第一個" />
      <ChildA name={`第二個: ${count}`} />
      <ChildB name="第三個" />
      <ChildB name={`第四個: ${count}`} />
    </div>
  );
}
