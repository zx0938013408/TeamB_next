"use client";
import { useState } from "react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

export default function FilterSideBar({
  categories = [],
  pdTypes = [],
  filters,
  setFilters,
  selectedCategory,
  selectedPdTypes = [],
  onCategorySelect,
  onPdTypeToggle,
  onClear,
}) {
  // ✅ 解構 filters
  const [priceRange, setPriceRange] = useState([1000, 3000]);
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}
    >
      <h3>主分類</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              backgroundColor: category === selectedCategory ? "#333" : "#eee",
              color: category === selectedCategory ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: "1rem" }}>子分類</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        {pdTypes.map((type) => (
          <label key={type} style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              value={type}
              checked={selectedPdTypes.includes(type)}
              onChange={(e) => onPdTypeToggle(e.target.value, e.target.checked)}
              style={{ marginRight: "0.5rem" }}
            />
            {type}
          </label>
        ))}
      </div>

      <h3>價格區間</h3>
      <div style={{ marginBottom: "1rem" }}>
      {/* <Range
          min={0}
          max={5000}
          step={100}
          value={[filters.priceRange.min, filters.priceRange.max]}
          onChange={(value) => {
            const [min, max] =value
            console.log("Range 是：", Range);
            setFilters((prev) => ({
              ...prev,
              priceRange: { min, max },
            }));
          }}
        /> */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginTop: "0.5rem" }}>
          <span>最低：${priceRange.min}</span>
          <span>最高：${priceRange.max}</span>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={onClear}
          style={{
            background: "transparent",
            border: "none",
            color: "#0070f3",
            cursor: "pointer",
          }}
        >
          清除篩選
        </button>
      </div>
    </div>
  );
}
