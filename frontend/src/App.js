import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header';
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import NoPageFound from "./pages/NoPageFound";
import FilterSidebar from "./components/FilterSidebar";


//products
import Allproducts from "./Products/Allproducts";
import AddProduct from "./Products/AddProduct";
import EditProduct from "./Products/EditProduct";
import Product from "./Products/Product";



import Loader from  "./pages/Loader"

//messages to user
import SendMessages from "./components/SendMessages";
import AllMessages from "./pages/AllMessages";


import ContactUs from "./components/ContactUs"
import ConfirmationForm from "./service/ConfirmationForm";
import Purchase from "./pages/Purchase";
import Wishlist from "./pages/Wishlist";
import Compare from "./pages/Compare";



//user
import UserRegister from "./User/UserRegister";
import UserLogin from "./User/UserLogin";
import GetUserById from "./User/UserProfile";
import Profile from "./User/MyProfile";
import EditMyProfile from "./User/EditMyProfile";


//admin
import WaitingPosts from "./adminPanel/WaitingPosts";


const user = localStorage.getItem("token");

export default function App() {
  return (
    <BrowserRouter>
        <Header user={user} />
    
      <div style={{ minHeight: "calc(100vh - 150px)" }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path ="ContactUs" element={<ContactUs />} />
          

          <Route path="loader" element={<Loader />} />


          <Route path="Register" element={<UserRegister />} />
          <Route path="/confirm-registration" element={<ConfirmationForm />} />

          <Route path="userLogin" element={<UserLogin />} />
          <Route path="Profile" element={<Profile />} />

          <Route path="users/:id" element={<GetUserById/>} />
          <Route path="users/EditMyProfile/:id" element={<EditMyProfile />} />

          <Route path="sendMessage/:id" element={<SendMessages />} />
          <Route path="AllMessages" element={<AllMessages />} />

          <Route path="WaitingPosts" element={<WaitingPosts />} />


          <Route path="products/:id" element={<Product />} />
          <Route path="Allproducts" element={<Allproducts />} />
          <Route path="FilterSidebar" element={<FilterSidebar />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="edit/:id" element={<EditProduct />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="compare" element={<Compare />} />


          <Route path="purchase" element={<Purchase />} />

          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}
