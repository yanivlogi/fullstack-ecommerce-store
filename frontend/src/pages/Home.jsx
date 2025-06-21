import React from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/ChatBox"; // Import the ChatBox component
import SomePosts from "../components/SomePosts"; // Import the ChatBox component
import ButtonBite from '../components/buttons/buttonEdit/ButtonBite';

import homeImage from "../uploads/logo.png";

const Home = () => {
  
  return (
    
    <div className="container mt-5">
      
      <div className="row" style={{direction:'rtl', backgroundColor:"white", padding:'20px', border:"thick double rgb(50, 161, 206)"}}>
        <div className="col-md-6">
          <div>
            <h1 className="display-4"> ביס מהטבע </h1>
            <p className="lead" style={{ direction: "rtl" }}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
               Voluptatum ex excepturi odit facilis deleniti impedit perspiciatis nostrum cupiditate laborum.
                Alias voluptate quia architecto, mollitia quasi dolor dolorem rerum. Doloribus, nesciunt.
            </p>
            <div className="justify-content-center" style={{padding:'30px', margin:"10px"}}>
                <ButtonBite to="/AllPosts">לכל הפוסטים</ButtonBite>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div>
            <img
              src={homeImage}
              alt="Cute animals"
              className="img-fluid"
            />
          </div>
        </div>
      </div>
      <div className="row mt-3" >
        <div className="col-md-6">
          <SomePosts />
        </div>
        <div className="col-md-6">
          <div className="chatbox-container">
              <ChatBox />
            <div className="chatbox-wrapper">
             
            </div>
          </div>
        </div>
      </div>
      <br />
       <br />
    </div>
  );
};

export default Home;
