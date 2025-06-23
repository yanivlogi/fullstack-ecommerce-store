
import { useState, useEffect, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import axios from "axios";
import logo from "../uploads/logo.png";
import "../css/Header.css";
import CartSlide from "./CartSlide";

const pagesMenu = [
  { label: "אודות", path: "/aboutus" },
  { label: "שאלות נפוצות", path: "/faq" },
  { label: "צור קשר", path: "/contactus" },
];
const categoriesMenu = [
  { label: "ירקות", path: "/cat/vegetables" },
  { label: "פירות", path: "/cat/fruits" },
  { label: "אורגני", path: "/cat/organic" },
];

export default function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [count, setCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState([
    { name: "מוצר לדוגמה", price: 20 },
    { name: "מוצר נוסף", price: 35 },
  ]);
  const server = process.env.REACT_APP_SERVER_URL;

  const getHeaderInfo = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(`${server}/Header`, {
        headers: { Authorization: token },
      });
      setIsLogged(true);
      setUser(data.data);
    } catch (err) {
      console.error(err);
    }
  }, [server]);

  const getUnread = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const { data } = await axios.get(`${server}/unreadMessageCount`, {
        headers: { Authorization: token },
      });
      setCount(data.count);
    } catch (err) {
      console.error(err);
    }
  }, [server]);

  useEffect(() => {
    getHeaderInfo();
    getUnread();
  }, [getHeaderInfo, getUnread]);

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="topbar">
        <div className="container flex-between">
          <span>ברוך הבא לחנות כפרי!</span>
          <div className="top-links">

            {isLogged ? (
              <NavLink to="/profile">👤 {user?.name}</NavLink>
            ) : (
              <NavLink to="/userlogin">🔑 התחברות</NavLink>
            )}
            <NavLink to="#">🌐 עברית</NavLink>
            <NavLink to="#">💱 ₪ ILS</NavLink>
          </div>
        </div>
      </div>

      <header className="midbar">
        <div className="container midbar-grid">
          <div className="nav-left">
            <nav className="nav-desktop">
              {pagesMenu.map((p) => (
                <NavLink key={p.path} to={p.path}>{p.label}</NavLink>
              ))}
              {categoriesMenu.map((c) => (
                <NavLink key={c.path} to={c.path}>{c.label}</NavLink>
              ))}
              {isLogged && (
                <button onClick={logout} className="logout-btn">התנתק/י</button>
              )}
            </nav>
            <div
              className={`hamburger ${mobileOpen ? "open" : "close"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="תפריט"
            >
              <div></div>
              <div></div>
              <div></div>
            </div>

          </div>

          <Link className="logo" to="/">
            <img src={logo} alt="logo" />
          </Link>

          <div className="icons">
            <NavLink to="/profile">👤</NavLink>
            <NavLink to="/wishlist">❤️</NavLink>
            <NavLink to="/compare">🔄</NavLink>
            <span className="cart-icon" onClick={() => setCartOpen(true)}>
              🛒<small>{count}</small>
            </span>
          </div>
        </div>
                <div className="container">

        <nav className={`navbar ${mobileOpen ? "open" : "close"}`}> 
          <ul className="nav-list">
            {pagesMenu.map((p) => (
              <li key={p.path}><NavLink to={p.path}>{p.label}</NavLink></li>
            ))}
            {categoriesMenu.map((c) => (
              <li key={c.path}><NavLink to={c.path}>{c.label}</NavLink></li>
            ))}
            {isLogged && (
              <li><button onClick={logout} className="logout-btn">התנתק/י</button></li>
            )}
          </ul>
        </nav>
        </div>
      </header>
      <CartSlide
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
      />
    </>
  );
}
