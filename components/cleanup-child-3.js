import React, { useEffect, useRef, useState } from "react";

export default function CleanupChild3() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("CleanupChild3 已掛載");
    return () => {
      console.log("CleanupChild3 將要缷載");
    };
  }, []);

  useEffect(() => {
    console.log("CleanupChild3 已更新");
    return () => {
      console.log("CleanupChild3 cleanup");
    };
  }, [count]);

  return (
    <>
      <div>
        CleanupChild3
        <div>
          <button onClick={() => setCount((prev) => prev + 1)}>click</button>
        </div>
        <div>{count}</div>
      </div>
    </>
  );
}
