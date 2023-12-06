import React from "react";
import { Link } from "react-router-dom";
import ChatBox from "../components/ChatBox"; // Import the ChatBox component
import SomePosts from "../components/SomePosts"; // Import the ChatBox component
import homeImage from "../uploads/homeImage.png";

const Home = () => {
  
  return (
    <div className="container mt-5">
      <div className="row" style={{direction:'rtl', backgroundColor:"white", padding:'20px', border:"thick double rgb(50, 161, 206)"}}>
        <div className="col-md-6">
          <div>
            <h1 className="display-4"> ברוכים הבאים ל - PetHouse</h1>
            <p className="lead" style={{ direction: "rtl" }}>
              אנחנו קהילה של אוהבי בעלי חיים המוקדשים לעזור לבעלי חיים למצוא את בתיהם לנצח.
              עיין בבעלי החיים הזמינים שלנו או פרסם אחד חדש כדי למצוא להם משפחה אוהבת.
            </p>
            <div className="justify-content-center" style={{padding:'30px', margin:"10px"}}>
              <Link to="/AllPosts" className="btn btn-primary" style={{padding:'10px', margin:"5px"}} >
                הצג את חיות המחמד
              </Link>
              <Link to="/addPost" className="btn btn-primary" style={{padding:'10px', margin:"5px"}} >
                פרסם חיית מחמד
              </Link>
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
            <div className="chatbox-wrapper">
              <ChatBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
