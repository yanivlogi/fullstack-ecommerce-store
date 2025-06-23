import React from 'react';
import '../css/CartSlide.css';

export default function CartSlide({ isOpen, onClose, items = [] }) {
  return (
    <div className={`cart-slide ${isOpen ? 'open' : ''}`}>\
      <div className="cart-slide-overlay" onClick={onClose}></div>\
      <div className="cart-slide-content">\
        <button className="close-btn" onClick={onClose}>×</button>\
        <h2>העגלה שלי</h2>\
        {items.length === 0 ? (\
          <p>העגלה ריקה</p>\
        ) : (\
          <ul>\
            {items.map((item, idx) => (\
              <li key={idx}>\
                <span>{item.name}</span>\
                <span>{item.price}₪</span>\
              </li>\
            ))}\
          </ul>\
        )}\
      </div>\
    </div>
  );
}
