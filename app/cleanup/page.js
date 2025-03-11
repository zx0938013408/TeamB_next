"use client";
import React, { useState } from "react";

export default function CleanUpPage() {
  const [showChild, setShowChild] = useState(false);
  return (
    <div>
      <div>
        <button onClick={() => setShowChild(!showChild)}>toggle</button>
      </div>
      {showChild ? (
        <>
          <div>Test</div>
          <div>Test</div>
          <div>Test</div>
        </>
      ) : null}
    </div>
  );
}
