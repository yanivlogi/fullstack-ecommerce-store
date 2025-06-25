import React, { useState } from 'react';
import '../css/Purchase.css';

const Purchase = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="purchase-container text-center">
        <h2>רכישה הושלמה!</h2>
        <p>תודה שקנית אצלנו.</p>
      </div>
    );
  }

  return (
    <div className="purchase-container">
      <form className="purchase-form" onSubmit={handleSubmit}>
        <h2>פרטי רכישה</h2>
        <div className="form-group">
          <label>שם מלא</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>כתובת משלוח</label>
          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>אימייל</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>טלפון</label>
          <input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">אשר רכישה</button>
      </form>
    </div>
  );
};

export default Purchase;
