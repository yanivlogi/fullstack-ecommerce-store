import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import NoPageFound from "./pages/NoPageFound";
import ContackUs from "./pages/ContacUs"



//posts
import AllPosts from "./posts/AllPosts";
import AddPost from "./posts/AddPost";
import EditPost from "./posts/EditPost";
import Post from "./posts/Post";
import SomePosts from "./components/SomePosts";
import MyPosts from "./posts/MyPosts";
import AdoptedPosts from "./posts/AdoptedPosts";

//user
import UserRegister from "./User/UserRegister";
import ConfirmationForm from "./service/ConfirmationForm";
import UserLogin from "./User/UserLogin";
import GetUserById from "./User/UserProfile";
import Profile from "./User/MyProfile";
import EditMyProfile from "./User/EditMyProfile";

//messages to user
import SendMessages from "./components/SendMessages";
import AllMessages from "./pages/AllMessages";



// import Account from "./pages/User/Profile";



export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "calc(100vh - 150px)" }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="AboutUs" element={<AboutUs />} />
          <Route path ="ContactUs" element={<ContackUs />} />

          <Route path="Register" element={<UserRegister />} />
          <Route path="/confirm-registration" element={<ConfirmationForm />} />
          <Route path="userLogin" element={<UserLogin />} />
          <Route path="Profile" element={<Profile />} />

          <Route path="users/:id" element={<GetUserById/>} />
          <Route path="users/EditMyProfile/:id" element={<EditMyProfile />} />

          <Route path="sendMessage/:id" element={<SendMessages />} />
          <Route path="AllMessages" element={<AllMessages />} />


          <Route path="posts/:id" element={<Post />} />
          <Route path="MyPosts" element={<MyPosts />} />
          <Route path="AllPosts" element={<AllPosts />} />
          <Route path="someposts" element={<SomePosts />} />
          <Route path="addPost" element={<AddPost />} />
          <Route path="edit/:id" element={<EditPost />} />
          <Route path="AdoptedPosts" element={<AdoptedPosts />} />
          
          <Route path="*" element={<NoPageFound />} />

  
        </Routes>
      </div>
      
    </BrowserRouter>
  );
}
