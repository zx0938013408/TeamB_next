"use client";

import { useState, useEffect } from "react";
import { AB_LIST } from "@/config/api-path";

export default function ABListPage() {
  const [listData, setListData] = useState({
    success: false,
    perPage: 0,
    totalRows: 0,
    totalPages: 0,
    page: 0,
    rows: [],
    keyword: "",
  });

  useEffect(() => {
    fetch(AB_LIST)
      .then((r) => r.json())
      .then((obj) => {
        console.log(obj);
        if (obj.success) {
          setListData(obj);
        }
      });
  }, []);

  console.log(listData);
  return (
    <div>
      <pre>{JSON.stringify(listData, null, 4)}</pre>
    </div>
  );
}
