import React, { useState } from 'react';
import '../css/Wishlist.css';

export default function Wishlist() {
  const [items] = useState([
    { id: 1, name: 'מוצר 1', price: 20, image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'מוצר 2', price: 35, image: 'https://via.placeholder.com/80' }
  ]);

  if (!items.length) {
    return (
      <div className="wishlist-container text-center">
        <h2>❤️ רשימת המשאלות ריקה</h2>
        <p>הוסיפו מוצרים כדי לשמור אותם לפעם הבאה.</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">❤️ רשימת המשאלות שלי</h2>
      <div className="wishlist-items">
        {items.map((item) => (
          <div key={item.id} className="wishlist-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <strong>{item.name}</strong>
              <div>{item.price}₪</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}