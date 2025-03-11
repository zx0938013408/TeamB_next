"use client";
import React, { useState } from "react";
import CleanupChild1 from "@/components/cleanup-child-1";
import CleanupChild2 from "@/components/cleanup-child-2";
import CleanupChild3 from "@/components/cleanup-child-3";

export default function CleanUpPage() {
  const [showChild, setShowChild] = useState(false);
  return (
    <div>
      <div>
        <button onClick={() => setShowChild(!showChild)}>toggle</button>
      </div>
      {showChild ? (
        <>
          {/* 
          <CleanupChild1 />
          <CleanupChild2 />
          */}
          <CleanupChild3 />
        </>
      ) : null}
    </div>
  );
}
