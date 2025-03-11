"use client";
import React, { useState } from "react";
import CleanupChild1 from "@/components/cleanup-child-1";

export default function CleanUpPage() {
  const [showChild, setShowChild] = useState(false);
  return (
    <div>
      <div>
        <button onClick={() => setShowChild(!showChild)}>toggle</button>
      </div>
      {showChild ? (
        <>
          <CleanupChild1 />
          <div>Test</div>
          <div>Test</div>
        </>
      ) : null}
    </div>
  );
}
