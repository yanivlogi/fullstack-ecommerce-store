import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import InputEmoji from "react-input-emoji";
import { Button } from "react-bootstrap";
import { useCart } from "../context/CartContext"; // מסלול בהתאם לפרויקט שלך
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Product.css";

const Product = () => {
  const [decoded, setDecoded] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);

  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct();
    getComments();
    const token = localStorage.getItem("token");
    if (token) {
      setDecoded(jwt_decode(token));
    }
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(`${server_url}/product/${id}`);
      const postData = response.data;

      let imagePaths = (postData.images || "")
        .split(",")
        .map((path) => path.trim().replace(/^uploads[\\/]/, "/"))
        .filter((path) => path !== "");

      imagePaths = imagePaths.length > 0
        ? imagePaths.map((path) => `${server_url}/${path}`)
        : ["/uploads/default-product.jpg"];

      const authorImage = postData.author?.image
        ? `${server_url}/${postData.author.image}`
        : "/uploads/default-product.jpg";

      setPost({
        ...postData,
        image: imagePaths,
        author: {
          ...postData.author,
          image: authorImage,
        },
      });
    } catch (err) {
      console.error("שגיאה בטעינת המוצר", err);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get(`${server_url}/products/${id}/comments`);
      setComments(response.data);
    } catch (err) {
      console.error("שגיאה בטעינת תגובות", err);
    }
  };

  const handleAddToCart = () => {
    if (!post) return;
    addToCart({
      _id: post._id,
      name: post.name,
      price: post.priceSale || post.price,
      image: post.image[0],
      quantity,
      stock: post.stock,
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % post.image.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? post.image.length - 1 : prev - 1
    );
  };

  return (
    <div className="product-container container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {post ? (
            <div className="card product-card">
              <h2 className="product-title">{post.name}</h2>

              <table className="table text-end product-details">
                <tbody>
                  <tr><td>קטגוריה</td><td>{post.category}</td></tr>
                  <tr><td>סוג</td><td>{post.type}</td></tr>
                  <tr><td>מחיר</td><td>₪{post.price}</td></tr>
                  {post.priceSale && (
                    <tr><td>מחיר מבצע</td><td>₪{post.priceSale}</td></tr>
                  )}
                  <tr><td>מלאי</td><td>{post.stock}</td></tr>
                  <tr><td>מיקום בחנות</td><td>{post.storeLocation}</td></tr>
                  <tr><td>תיאור</td><td>{post.description}</td></tr>
                  <tr>
                    <td>רכישה</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <span>{quantity}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => setQuantity(quantity + 1)}>+</button>
                        <button className="btn btn-success" onClick={handleAddToCart}>הוסף לעגלה 🛒</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="product-image-wrapper text-center position-relative">
                <img
                  src={post.image[currentImageIndex]}
                  className="product-image"
                  alt="מוצר"
                />
                {post.image.length > 1 && (
                  <div className="product-nav-btns">
                    <button className="product-image-button product-image-prev" onClick={prevImage}>◀</button>
                    <button className="product-image-button product-image-next" onClick={nextImage}>▶</button>
                  </div>
                )}
              </div>

              <div className="product-comments mt-5">
                <h4>תגובות ({comments.length})</h4>
                {decoded ? (
                  <form className="d-flex mt-3" onSubmit={(e) => e.preventDefault()}>
                    <InputEmoji
                      value={content}
                      onChange={setContent}
                      placeholder="כתוב תגובה..."
                      className="form-control"
                    />
                    <button type="submit" className="btn btn-primary ms-2">שלח</button>
                  </form>
                ) : (
                  <div className="text-center mt-3">
                    <p>רק משתמשים רשומים יכולים להגיב</p>
                    <Link to="/userLogin" className="btn btn-primary m-1">התחברות</Link>
                    <Link to="/register" className="btn btn-primary m-1">הרשמה</Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center mt-5">טוען...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
