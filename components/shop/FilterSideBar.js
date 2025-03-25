import styles from "../../styles/shop/filter-sidebar.module.css";
const FilterSidebar = ({ filters, onFilterChange }) => {
  // 處理 checkbox 變更
  const handleCheckboxChange = (category, value) => {
    onFilterChange(category, value);
  };

  // 處理價格輸入變化
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onFilterChange("priceRange", { ...filters.priceRange, [name]: value });
  };

  return (
    <div className="sidebar">
      {/* 篩選列 */}
      {/* <div>
        <select
          id="people"
          name="people"
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="date">最新上架</option>
          <option value="location">價錢由高至低</option>
          <option value="price">價前由低至高</option>
        </select>
      </div> */}

      {/* 運動分類篩選 */}
      <div className={styles.filterSection}>
        <div className={styles.title}>運動分類</div>
        <div className={styles.check}>
          {["籃球", "排球", "羽毛球"].map((sport) => (
            <label key={sport} className={styles.label}>
              <input
                className={styles.input}
                type="checkbox"
                onChange={() => handleCheckboxChange("sports", sport)}
                checked={filters.sports.includes(sport)}
              />
              {sport}
            </label>
          ))}
        </div>
        {/* 服飾分類篩選 */}
        <div className={styles.check}>
          <div className={styles.title}>服飾分類</div>
          {["長袖", "短袖", "包包", "水壺", "其他配件"].map((apparel) => (
            <label key={apparel}>
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange("apparel", apparel)}
                checked={filters.apparel.includes(apparel)}
              />
              {apparel}
            </label>
          ))}
        </div>
      </div>

      {/* 價格範圍篩選 */}
      <div>
        <div className={styles.title}>價格</div>
        <input
          type="number"
          name="min"
          placeholder="最低價"
          value={filters.priceRange.min}
          onChange={handlePriceChange}
        />
        -
        <input
          type="number"
          name="max"
          placeholder="最高價"
          value={filters.priceRange.max}
          onChange={handlePriceChange}
        />
        <div className={styles.filterBtn}></div>
        <button className={styles.btn}>篩選</button>
      </div>
    </div>
  );
};

export default FilterSidebar;
