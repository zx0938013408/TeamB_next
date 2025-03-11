import React, { useEffect } from "react";

export default function CleanupChild1() {
  useEffect(() => {
    console.log("CleanupChild1 mounted");
    return () => {
      console.log("CleanupChild1 will unmount");
    };
  }, []);

  return (
    <>
      <div>CleanupChild1</div>
    </>
  );
}
