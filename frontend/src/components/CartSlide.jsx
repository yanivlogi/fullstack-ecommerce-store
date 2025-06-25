import React from 'react';
import { Link } from 'react-router-dom';
import '../css/CartSlide.css';
import { useCart } from '../context/CartContext';

export default function CartSlide({ isOpen, onClose }) {
  const { items = [], updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shipping = 50;
  const total = subtotal + shipping;
  const freeShippingLimit = 70;

  return (
    <div className={`cart-slide ${isOpen ? 'open' : ''}`}>
      <div className="cart-slide-overlay" onClick={onClose}></div>
      <div className="cart-slide-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="cart-title">🛍️ העגלה שלך</h2>

        <p className="shipping-progress-text">
          חסר לך {Math.max(freeShippingLimit - subtotal, 0).toFixed(2)}₪ למשלוח חינם!
        </p>
        <div className="shipping-progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${Math.min((subtotal / freeShippingLimit) * 100, 100)}%` }}
          ></div>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p>העגלה ריקה</p>
          ) : (
            items.map((item, idx) => (
              <div className="cart-item" key={idx}>
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <strong>{item.name}</strong>
                  {item.size && <div>מידה: {item.size}</div>}
                  {item.color && <div>צבע: {item.color}</div>}
                  <div>מחיר: {item.price}₪</div>
                  <div className="quantity-control">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                    הסר מוצר
                  </button>
                </div>
                <span className="item-total">{item.price * item.quantity}₪</span>
              </div>
            ))
          )}
        </div>

        <div className="promo-code">
          <span>יש לך קוד קופון?</span>
        </div>

        <div className="summary">
          <div><span>סה״כ ביניים:</span><span>{subtotal}₪</span></div>
          <div><span>משלוח:</span><span>{shipping}₪</span></div>
          <div className="total"><strong>סה״כ:</strong><strong>{total}₪</strong></div>
        </div>

        <div className="cart-actions">
          <button className="keep-shopping" onClick={onClose}>המשך קנייה</button>
          <Link to="/purchase" className="checkout btn btn-primary">לתשלום</Link>
        </div>

        <div className="paypal-btn">PayPal</div>
      </div>
    </div>
  );
}
