import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import NoPageFound from "./pages/NoPageFound";
import FilterSidebar from "./components/FilterSidebar";

// Products
import Allproducts from "./Products/Allproducts";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import Product from "./Products/Product";

import Loader from "./pages/Loader";

// Messages
import SendMessages from "./components/SendMessages";
import AllMessages from "./pages/AllMessages";

// Contact & Purchase
import ContactUs from "./components/ContactUs";
import ConfirmationForm from "./service/ConfirmationForm";
import Purchase from "./pages/Purchase";

// Users
import UserRegister from "./User/UserRegister";
import UserLogin from "./User/UserLogin";
import GetUserById from "./User/UserProfile";
import Profile from "./User/MyProfile";
import EditMyProfile from "./User/EditMyProfile";

// Admin
import WaitingPosts from "./adminPanel/WaitingPosts";

// 🛒 Cart Slide
import CartSlide from "./components/CartSlide";

const user = localStorage.getItem("token");

export default function App() {
  const [cartOpen, setCartOpen] = useState(false); // 🔥 מצב פתיחת העגלה

  return (
    <BrowserRouter>
      <Header user={user} />

      <div style={{ minHeight: "calc(100vh - 150px)" }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path="ContactUs" element={<ContactUs />} />
          <Route path="loader" element={<Loader />} />

          {/* משתמשים */}
          <Route path="Register" element={<UserRegister />} />
          <Route path="/confirm-registration" element={<ConfirmationForm />} />
          <Route path="userLogin" element={<UserLogin />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="users/:id" element={<GetUserById />} />
          <Route path="users/EditMyProfile/:id" element={<EditMyProfile />} />

          {/* הודעות */}
          <Route path="sendMessage/:id" element={<SendMessages />} />
          <Route path="AllMessages" element={<AllMessages />} />

          {/* ניהול */}
          <Route path="WaitingPosts" element={<WaitingPosts />} />

          {/* מוצרים */}
          <Route path="product/:id" element={<Product />} />
          <Route path="Allproducts" element={<Allproducts onOpenCart={() => setCartOpen(true)} />} />
          <Route path="FilterSidebar" element={<FilterSidebar />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="edit/:id" element={<EditProduct />} />

          {/* רכישה */}
          <Route path="purchase" element={<Purchase />} />

          {/* דף שגיאה */}
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </div>

      {/* ✅ קומפוננטת העגלה מחוץ ל־Routes */}
      <CartSlide isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </BrowserRouter>
  );
}
