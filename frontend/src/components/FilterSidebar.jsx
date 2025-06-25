import React, { useEffect, useRef, useState } from "react";
import "../css/FilterSidebar.css";
import filterIcon from "../uploads/filter.png";

const FilterSidebar = ({
  isMobile,
  isSidebarOpen,
  setSidebarOpen,
  category,
  type,
  searchQuery,
  minPrice,
  maxPrice,
  categories,
  typeOptions,
  setCategory,
  setType,
  setSearchQuery,
  setMinPrice,
  setMaxPrice,
  handleSearch
}) => {
  const containerRef = useRef(null);
  const startX = useRef(null);
  const currentX = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    const handleTouchStart = (e) => {
      startX.current = e.touches[0].clientX;
      currentX.current = startX.current;
      setDragging(true);
    };

    const handleTouchMove = (e) => {
      if (!dragging) return;
      currentX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (!dragging) return;
      const deltaX = currentX.current - startX.current;

      if (deltaX < -50) {
        setSidebarOpen(true);
      } else if (deltaX > 50) {
        setSidebarOpen(false);
      }

      setDragging(false);
    };

    if (container && isMobile) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container && isMobile) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [dragging, setSidebarOpen, isMobile]);

  const handleReset = () => {
    setCategory("");
    setType("");
    setSearchQuery("");
    setMinPrice(0);
    setMaxPrice(0);
    handleSearch(); // להריץ את החיפוש מחדש עם ערכים מאופסים
  };

  return (
    <>
      {isMobile && isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {isMobile && (
        <div
          className={`drag-button ${isSidebarOpen ? "hidden" : ""}`}
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "סגור תפריט" : "פתח תפריט"}
        >
          {isSidebarOpen ? "↪" : (
            <img src={filterIcon} alt="סינון" style={{ width: "24px", height: "24px" }} />
          )}
        </div>
      )}

      <div
        className={`filter-slide-container ${isMobile ? "mobile" : "desktop"} ${isSidebarOpen ? "open" : ""}`}
        ref={containerRef}
      >
        <div className="filter-sidebar">
          <h2>סינון מתקדם</h2>

          <label>קטגוריה:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">הכל</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label>סוג:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">בחר סוג</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label>חיפוש לפי שם:</label>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          <label>מחיר (מ-עד):</label>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />

          <button onClick={handleSearch}>חפש</button>
          <button onClick={handleReset} style={{ marginTop: "8px", background: "#ccc" }}>איפוס</button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
