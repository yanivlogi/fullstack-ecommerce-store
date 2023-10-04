import React from "react";
import { Link } from "react-router-dom";
import ChatBox from "./components/ChatBox"; // Import the ChatBox component
import SomePosts from "./components/SomePosts"; // Import the ChatBox component
import homeImage from "../uploads/homeImage.jpg";

const Home = () => {
  
  return (
    <div className="container mt-5">
      <div className="row" style={{direction:'rtl'}}>
        <div className="col-md-6">
          <div>
            <h1 className="display-4"> ברוכים הבאים ל - PetHouse</h1>
            <p className="lead" style={{ direction: "rtl" }}>
              אנחנו קהילה של אוהבי בעלי חיים המוקדשים לעזור לבעלי חיים למצוא את בתיהם לנצח.
              עיין בבעלי החיים הזמינים שלנו או פרסם אחד חדש כדי למצוא להם משפחה אוהבת.
            </p>
            <div className="d-flex justify-content-center">
              <Link to="/AllPosts" className="btn btn-primary btn-lg me-3">
                הצג את חיות המחמד
              </Link>
              <Link to="/addPost" className="btn btn-secondary btn-lg">
                פרסם חיית מחמד
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="border border-primary rounded-circle p-3">
            <img
              src={homeImage}
              alt="Cute animals"
              className="img-fluid rounded-circle"
            />
          </div>
        </div>
      </div>
      <div className="row mt-5" >
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
