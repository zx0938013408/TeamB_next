"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "@/config/api-path";

export default function ABListPage() {
  useEffect(() => {
    fetch(AB_LIST)
      .then((r) => r.json())
      .then((obj) => {
        console.log(obj);
      });
  }, []);

  return <div>ABListPage</div>;
}
