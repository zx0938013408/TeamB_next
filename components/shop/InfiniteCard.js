"use client";

import { useState, useEffect, useRef, useMemo } from "react";

function InfiniteCard({
  categoryId,
  items = [],
  itemsPerPage = 10,
  onDataChange = () => {},
}) {
  const [page, setPage] = useState(1);
  const lastItemRef = useRef(null);

  // ✅ 使用 useMemo 優化，避免 filteredItems 每次都是新陣列
  const filteredItems = useMemo(() => {
    return categoryId
      ? items.filter((item) => item.category_id === categoryId || item.parent_category_id === categoryId)
      : items;
  }, [categoryId, items]);

  // ✅ 初始化一次資料傳出
  useEffect(() => {
    const initialData = filteredItems.slice(0, itemsPerPage);
    setPage(1);
    onDataChange(initialData);
  }, [filteredItems]);

  // ✅ IntersectionObserver 處理滾動觸發加載
  useEffect(() => {
    if (!lastItemRef.current) return;

    const observerInstance = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreData();
        }
      },
      { threshold: 1.0 }
    );

    observerInstance.observe(lastItemRef.current);

    return () => observerInstance.disconnect();
  }, [filteredItems, page]);

  // ✅ 滾動加載更多資料
  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = filteredItems.slice(0, nextPage * itemsPerPage);
    setPage(nextPage);
    onDataChange(nextData);
  };

  // ✅ 回傳 ref 給頁面使用
  return <div ref={lastItemRef} style={{ height: 1 }} />;
}

export default InfiniteCard;
