"use client";
import { useState } from "react";
// import Slider, { Range } from "rc-slider";
// import "rc-slider/assets/index.css";

export default function FilterSideBar({
  categories = [],
  pdTypes = [],
  themes = [], // ✅ 加入主題清單
  filters,
  setFilters,
  selectedCategory,
  selectedPdTypes = [],
  selectedThemes = [], // ✅ 新增選中的主題
  onCategorySelect,
  onPdTypeToggle,
  onThemeToggle, // ✅ 新增主題切換事件
  onClear,
}) {
  // ✅ 解構 filters
  const [priceRange, setPriceRange] = useState([1000, 3000]);
  const [expandedThemes, setExpandedThemes] = useState([]);

  // 拆主題群組與子主題
  const mainThemes = themes.filter((t) => t.parent_id === null);
  const subThemes = themes.filter((t) => t.parent_id !== null);

  const toggleThemeGroup = (id) => {
    setExpandedThemes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedMainCategory = categories.find(
    (cat) => cat.name === selectedCategory
  );
  const filteredSubCategories = pdTypes.filter(
    (sub) => sub.parent_id === selectedMainCategory?.id
  );
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}
    >
      {/* <h3 style={{ marginTop: "1rem" }}>主題分類</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
      {mainThemes.map((main) => {
        const children = subThemes.filter((t) => t.parent_id === main.id);
          const isExpanded = expandedThemes.includes(main.id);
          return (
            <div key={main.id}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    value={main.name}
                    checked={selectedThemes.includes(main.name)}
                    onChange={(e) =>
                      onThemeToggle(e.target.value, e.target.checked)
                    }
                    style={{ marginRight: "0.5rem" }}
                  />
                  {main.name}
                </label>
                <button
                  onClick={() => toggleThemeGroup(main.id)}
                  style={{ fontSize: "12px", background: "none", border: "none", cursor: "pointer", color: "#0070f3" }}
                >
                  {isExpanded ? "收合" : "展開"}
                </button>
              </div>
              {isExpanded && (
                <div style={{ paddingLeft: "1rem", marginTop: "0.25rem" }}>
                  {children.map((sub) => (
                    <label key={sub.id} style={{ display: "block", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        value={sub.name}
                        checked={selectedThemes.includes(sub.name)}
                        onChange={(e) =>
                          onThemeToggle(e.target.value, e.target.checked)
                        }
                        style={{ marginRight: "0.5rem" }}
                      />
                      {sub.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div> */}

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

      {/* <h3 style={{ marginTop: "1rem" }}>子分類</h3>
      {filteredSubCategories.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {filteredSubCategories.map((sub) => (
            <label key={sub.id} style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                value={sub.name}
                checked={selectedPdTypes.includes(sub.name)}
                onChange={(e) =>
                  onPdTypeToggle(e.target.value, e.target.checked)
                }
                style={{ marginRight: "0.5rem" }}
              />
              {sub.name}
            </label>
          ))}
        </div>
      ) : (
        <div style={{ fontSize: "14px", color: "#888" }}>請先選擇主分類</div>
      )} */}

      {/* <h3>價格區間</h3>
      <div style={{ marginBottom: "1rem" }}> */}
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
        {/* <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            marginTop: "0.5rem",
          }}
        >
          <span>最低：${priceRange.min}</span>
          <span>最高：${priceRange.max}</span>
        </div>
      </div> */}

      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={() => {
            onClear(); // 呼叫上層清除邏輯
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "#0070f3",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          清除篩選
        </button>
      </div>
    </div>
  );
}
