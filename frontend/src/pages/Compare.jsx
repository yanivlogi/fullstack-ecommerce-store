import React from 'react';
import '../css/Compare.css';

export default function Compare() {
  const items = [
    { id: 1, name: 'מוצר 1', price: 20, image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'מוצר 2', price: 35, image: 'https://via.placeholder.com/80' }
  ];

  return (
    <div className="compare-container">
      <h2 className="compare-title">🔄 השוואת מוצרים</h2>
      <div className="compare-table">
        <div className="table-header">
          <div>מוצר</div>
          <div>מחיר</div>
        </div>
        {items.map((item) => (
          <div key={item.id} className="table-row">
            <div className="product-cell">
              <img src={item.image} alt={item.name} />
              <span>{item.name}</span>
            </div>
            <div>{item.price}₪</div>
          </div>
        ))}
      </div>
    </div>
  );
}
