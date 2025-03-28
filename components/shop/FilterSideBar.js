"use client";
import { useState } from "react";

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
  const { priceRange } = filters;
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
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="number"
          placeholder="最低價"
          value={priceRange.min}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: { ...prev.priceRange, min: e.target.value },
            }))
          }
        />
        <input
          type="number"
          placeholder="最高價"
          value={priceRange.max}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priceRange: { ...prev.priceRange, max: e.target.value },
            }))
          }
        />
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
