import React from 'react';
import ReactDOM from 'react-dom/client';
import Footer from './components/Footer';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from "./context/CartContext";

import './App.css';
const user = localStorage.getItem("token");



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <React.StrictMode>
  <CartProvider>
    <App />
  </CartProvider>
</React.StrictMode>

);

