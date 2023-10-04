import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

import "../css/NoPage.css";
const NoPage = () => {
  return (
    <div className="not-found-container">
      <div className="animal-images">
        <img src="https://brookhurstanimal.com/wp-content/uploads/2017/09/Cooperative-Dog-1200x1200.png" alt="Dog" className="animal-image" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg" alt="Cat" className="animal-image" />
        <img src="https://cdn.shopify.com/s/files/1/0468/6734/9662/collections/Untitled_design_13.png?v=1662200333" alt="Hamster" className="animal-image" />
      </div>
      <h1 className="not-found-text">404</h1>
      <p className="not-found-description">Oops! Page Not Found</p>
      <Link to="/" className="home-button">
        Go to Home
      </Link>
    </div>
  );
};

export default NoPage;
