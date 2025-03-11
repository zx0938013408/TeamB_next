import React, { useEffect, useState } from "react";

export default function CleanupChild1() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    console.log("CleanupChild1 mounted");

    const interval_id = setInterval(() => {
      // console.log({ num }); // 因為 closure, num 只會拿到 0
      setNum((old) => old + 1);
    }, 300);

    return () => {
      console.log("CleanupChild1 will unmount");
      clearInterval(interval_id); // 把計時器停下來
    };
  }, []);

  return (
    <>
      <div>CleanupChild1 {num}</div>
    </>
  );
}
