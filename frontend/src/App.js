import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import NoPageFound from "./pages/NoPageFound";


//posts
import AllPosts from "./pages/posts/AllPosts";
import AddPost from "./pages/posts/AddPost";
import EditPost from "./pages/posts/EditPost";
import Post from "./pages/posts/Post";
import SomePosts from "./pages/components/SomePosts";
import MyPosts from "./pages/posts/MyPosts";
import AdoptedPosts from "./pages/posts/AdoptedPosts";

//user
import UserRegister from "./pages/User/UserRegister";
import UserLogin from "./pages/User/UserLogin";
import GetUserById from "./pages/User/UserProfile";
import Profile from "./pages/User/MyProfile";
import EditMyProfile from "./pages/User/EditMyProfile";

//messages to user
import SendMessages from "./pages/components/SendMessages";
import AllMessages from "./pages/AllMessages";


// import Account from "./pages/User/Profile";



export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "calc(100vh - 150px)" }}>
        <Routes>
          <Route index element={<Home />} />
          <Route path="AboutUs" element={<AboutUs />} />

          <Route path="Register" element={<UserRegister />} />
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
