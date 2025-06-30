import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";
import SomePosts from "../components/SomePosts";
import ChatBox from "../components/ChatBox";
import ButtonBite from "../components/buttons/buttonEdit/ButtonBite";
import heroImage from "../uploads/hero.jpg";

import fruitsImg from "../uploads/category-fruits.jpg";
import vegetablesImg from "../uploads/category-vegetables.jpg";
import greensImg from "../uploads/category-greens.png";
import frozenImg from "../uploads/category-frozen.jpg";

const Home = () => {
const categories = [
  { image: fruitsImg, label: "פירות"},
  { image: vegetablesImg, label: "ירקות"},
  { image: greensImg, label: "עלים"},
  { image: frozenImg, label: "פירות קפואים" },
];

  const toggleChat = () => {
    const el = document.querySelector(".chat-popup");
    el.classList.toggle("open");
  };

  const closeChat = () => {
    const el = document.querySelector(".chat-popup");
    el.classList.remove("open");
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <h1>ברוכים הבאים לביס מהטבע</h1>
          <p>פירות וירקות טריים, אורגניים ומקומיים – משלוח מהיום להיום</p>
          <ButtonBite to="/Allproducts">למעבר לחנות</ButtonBite>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="home-categories">
        <h2>קטגוריות מובילות</h2>
<div className="cat-grid">
  {categories.map((cat, index) => (
    <div className="cat-card" key={index}>
      <img src={cat.image} alt={cat.label} className="cat-image-clean" />
      <div className="cat-label">{cat.label}</div>
    </div>
  ))}
</div>

      </section>

      {/* PROMOTIONS */}
      <section className="home-promos">
        <div className="promo green">
          <h3>ירקות טריים</h3>
          <p>הנחות על מגוון ירקות מובחרים</p>
          <Link to="/Allproducts">לרכישה</Link>
        </div>
        <div className="promo orange">
          <h3>פירות עסיסיים</h3>
          <p>60% הנחה על פירות העונה</p>
          <Link to="/Allproducts">לרכישה</Link>
        </div>
      </section>

      {/* CHAT FLOATING BUBBLE */}
      <div className="chat-float-wrapper">
        <button className="chat-toggle-btn" onClick={toggleChat}>💬</button>

        <div className="chat-popup">
          <div className="chat-popup-header">
            <span>צ'אט עם נציג</span>
            <button className="close-btn" onClick={closeChat}>×</button>
          </div>
          <div className="chat-popup-body">
            <ChatBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
