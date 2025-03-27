"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/shop/filter-sidebar.module.css";

const FilterSidebar = ({ filters, onFilterChange }) => {
  const router = useRouter();
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isShow, setIsShow] = useState(false);

  // 處理分類篩選
  const handleCheckboxChange = (category, value, checked) => {
    let updatedCategories = selectedCategories;

    if (checked) {
      updatedCategories = [...selectedCategories, value];
    } else {
      updatedCategories = selectedCategories.filter((item) => item !== value);
    }

    setSelectedCategories(updatedCategories);

    // 更新網址參數
    let queryParams = [];
    if (updatedCategories.length > 0) {
      queryParams.push(`sport=${updatedCategories.join(",")}`);
    }
    if (selectedPrice.length > 0) {
      queryParams.push(
        `minPrice=${selectedPrice[0]}&maxPrice=${selectedPrice[1]}`
      );
    }

    router.push(`/shop?${queryParams.join("&")}`);
  };

  // 處理價格篩選
  const handlePriceChange = (min, max, checked) => {
    if (checked) {
      setSelectedPrice([min, max]);
    } else {
      setSelectedPrice([]);
    }

    // 更新網址參數
    let queryParams = [];
    if (selectedCategories.length > 0) {
      queryParams.push(`sport=${selectedCategories.join(",")}`);
    }
    if (checked) {
      queryParams.push(`minPrice=${min}&maxPrice=${max}`);
    }

    router.push(`/shop?${queryParams.join("&")}`);
  };

  // 清除篩選
  const clearSearch = () => {
    setSelectedPrice([]);
    setSelectedCategories([]);
    setIsShow(false);
    router.replace("/shop");
  };

  return (
    <div>
      {/* 運動分類篩選 */}
      <div className={styles.filterSection}>
        <div className={styles.title}>運動分類</div>
        <div className={styles.check}>
          {["籃球", "排球", "羽毛球"].map((sport) => (
            <label key={sport} className={styles.label}>
              <input

                type="checkbox"
                onChange={(e) =>
                  handleCheckboxChange("sport", sport, e.target.checked)
                }
                checked={selectedCategories.includes(sport)}
              />
              <span className={styles.checkMark}></span>
              {sport}
            </label>
          ))}
        </div>
        {/* 服飾分類篩選 */}
        <div className={styles.check}>
          <div className={styles.title}>服飾分類</div>
          {["長袖", "短袖", "後背包", "腰包", "提袋", "水壺", "其他配件"].map(
            (apparel) => (
              <label key={apparel} className={styles.label}>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange("apparel", apparel, e.target.checked)
                  }
                  checked={selectedCategories.includes(apparel)}
                />
                <span className={styles.checkMark}></span>
                {apparel}
              </label>
            )
          )}
        </div>
      </div>

      {/* 價格範圍篩選 */}
      <div>
        <div className={styles.title}>價格</div>
        {[
          { label: "100元以下", min: 1, max: 100 },
          { label: "100 - 500元", min: 100, max: 500 },
          { label: "500 - 1000元", min: 500, max: 1000 },
          { label: "1000元以上", min: 1000, max: "" },
        ].map((range, index) => (
          <label key={index} className={styles.label}>
            <input
              type="checkbox"
              onChange={(e) => handlePriceChange(range.min, range.max, e.target.checked)}
              checked={selectedPrice[0] === range.min && selectedPrice[1] === range.max}
            />
            <span className={styles.checkMark}></span>
            {range.label}
          </label>
        ))}
      </div>

      {/* <div className={styles.filterBtn}>
          <button
            type="submit"
            className={styles.btn}
            onClick={() => onFilterChange("applyFilters", true)}
          >
            篩選
          </button>
        </div> */}

        {isShow && (
        <div className={styles.clearSearch} onClick={clearSearch}>
          清除篩選
        </div>
      )}
    </div>
  );
};

export default FilterSidebar;
