import React from 'react';
import ReactDOM from 'react-dom';
import Header from './pages/components/Header';
import Footer from './pages/components/Footer';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const user = localStorage.getItem("token");



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Header user={user} />
    <App  />
    <Footer />
  </React.StrictMode>
);

