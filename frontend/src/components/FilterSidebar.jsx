import React, { useEffect, useRef, useState } from "react";
import "../css/FilterSidebar.css";

const FilterSidebar = ({
  isMobile,
  isSidebarOpen,
  setSidebarOpen,
  category,
  type,
  selectedGender,
  selectedLocation,
  searchQuery,
  isEducated,
  isCastrated,
  isImmune,
  minAge,
  maxAge,
  petsList,
  typeOptions,
  cities,
  setCategory,
  setType,
  setSelectedGender,
  setSelectedLocation,
  setSearchQuery,
  setIsEducated,
  setIsCastrated,
  setIsImmune,
  setMinAge,
  setMaxAge,
  handleSearch,
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
        // החלקה שמאלה – פותח
        setSidebarOpen(true);
      } else if (deltaX > 50) {
        // החלקה ימינה – סוגר
        setSidebarOpen(false);
      }

      setDragging(false);
    };

    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [dragging, setSidebarOpen]);

  return (
    <div
      className={`filter-slide-container ${isMobile ? "mobile" : ""} ${
        isSidebarOpen ? "open" : ""
      }`}
      ref={containerRef}
    >
    {isMobile && (
  <div
    className="drag-button"
    onClick={() => setSidebarOpen(!isSidebarOpen)}
    title={isSidebarOpen ? "סגור תפריט" : "פתח תפריט"}
  >
    {isSidebarOpen ? "↪" : "⏴"}
  </div>
)}


      <div className="filter-sidebar">
        <h2>סינון מתקדם</h2>

        <label>קטגוריה:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">הכל</option>
          {petsList.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>סוג:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">בחר סוג</option>
          {typeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <label>מין:</label>
        <select
          value={selectedGender}
          onChange={(e) => setSelectedGender(e.target.value)}
        >
          <option value="">הכל</option>
          <option value="זכר">זכר</option>
          <option value="נקבה">נקבה</option>
        </select>

        <label>מיקום:</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">הכל</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

        <label>חיפוש לפי שם:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <label>מחונך לצרכים:</label>
        <select
          value={isEducated}
          onChange={(e) => setIsEducated(e.target.value)}
        >
          <option value="">הכל</option>
          <option value="true">כן</option>
          <option value="false">לא</option>
        </select>

        <label>מסורס / מעוקרת:</label>
        <select
          value={isCastrated}
          onChange={(e) => setIsCastrated(e.target.value)}
        >
          <option value="">הכל</option>
          <option value="true">כן</option>
          <option value="false">לא</option>
        </select>

        <label>מחוסן/ת:</label>
        <select value={isImmune} onChange={(e) => setIsImmune(e.target.value)}>
          <option value="">הכל</option>
          <option value="true">כן</option>
          <option value="false">לא</option>
        </select>

        <label>גיל (מ-עד):</label>
        <input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />
        <input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />

        <span>▶כדי לסגור</span>
      </div>
    </div>
  );
};

export default FilterSidebar;
