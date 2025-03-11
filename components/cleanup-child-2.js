import React, { useEffect, useRef, useState } from "react";

export default function CleanupChild2() {
  const myRef = useRef();
  let n = 0;

  useEffect(() => {
    console.log("CleanupChild2 mounted");

    const interval_id = setInterval(() => {
      n++;
      myRef.current.innerHTML = n;
    }, 300);

    return () => {
      console.log("CleanupChild2 will unmount");
      clearInterval(interval_id); // 把計時器停下來
    };
  }, []);

  return (
    <>
      <div>
        CleanupChild2 <span ref={myRef}>0</span>
      </div>
    </>
  );
}
