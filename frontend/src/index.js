import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './components/Header';
import Footer from './components/Footer';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
const user = localStorage.getItem("token");



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
);

