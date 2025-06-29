import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";
import "react-toastify/dist/ReactToastify.css";
import "../css/Product.css";

const Product = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const server_url = process.env.REACT_APP_SERVER_URL;
  const { addToCart } = useCart();

  useEffect(() => {
    getProduct();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(`${server_url}/product/${id}`);
      const postData = response.data;
      let imagePaths = (postData.images || "")
        .split(",")
        .map((path) => path.trim().replace(/^uploads[\\/]/, "/"))
        .filter((path) => path !== "");
      imagePaths =
        imagePaths.length > 0
          ? imagePaths.map((path) => `${server_url}/${path}`)
          : ["/uploads/default-product.jpg"];
      setPost({ ...postData, image: imagePaths });
    } catch (err) {
      console.error("שגיאה בטעינת המוצר", err);
    }
  };

  const browseNextImage = () => {
    if (post?.image?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % post.image.length);
    }
  };

  const browsePreviousImage = () => {
    if (post?.image?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? post.image.length - 1 : prev - 1
      );
    }
  };

  const handleAddToCart = () => {
    if (post) {
      addToCart(post, quantity);
      toast.success("✅ נוסף לעגלה!");
    }
  };

  return post ? (
    <>
      <ToastContainer />
      <div className="product-details-page container">
        <div className="row align-items-start product-wrapper">
          <div className="col-md-6">
            <div className="product-image-wrapper text-center">
              <img
                src={post.image[currentImageIndex]}
                className="img-fluid product-main-image mb-3"
                alt={post.name}
              />
              {post.image.length > 1 && (
                <div className="product-nav-btns">
                  <button
                    className="product-image-button product-image-prev"
                    onClick={browsePreviousImage}
                  >
                    ▶
                  </button>
                  <button
                    className="product-image-button product-image-next"
                    onClick={browseNextImage}
                  >
                    ◀
                  </button>
                </div>
              )}

              <div className="product-thumbs d-none d-md-flex justify-content-center gap-2 mt-3">
                {post.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt=""
                    className={`img-thumbnail product-thumb ${
                      index === currentImageIndex ? "border-primary" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-6 product-info">
            <h2 className="product-title mb-3">{post.name}</h2>
            <hr />
            <div className="mb-2">
              <strong>מחיר: </strong>
              <span className="text-danger">
                ₪{post.priceSale || post.price}
              </span>
              {post.priceSale && (
                <del className="text-muted ms-2">₪{post.price}</del>
              )}
            </div>
            <hr />
            <table className="product-table w-100 mt-3">
  <tbody>
    <tr>
      <td><strong>קטגוריה:</strong></td>
      <td>{post.category}</td>
    </tr>
    <tr>
      <td><strong>סוג:</strong></td>
      <td>{post.type}</td>
    </tr>
    <tr>
      <td><strong>מלאי:</strong></td>
      <td>{post.stock}</td>
    </tr>
    <tr>
      <td><strong>מיקום בחנות:</strong></td>
      <td>{post.storeLocation}</td>
    </tr>
    <tr>
      <td><strong>תיאור:</strong></td>
      <td>{post.description}</td>
    </tr>
  </tbody>
</table>

            <hr />

            {!isMobile && (
              <>
                <div className="d-flex align-items-center mb-3">
                  <strong className="me-2">כמות:</strong>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </button>
                  <span className="mx-2">{quantity}</span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="product-actions d-flex flex-wrap gap-2">
                  <Button className="btn btn-success" onClick={handleAddToCart}>
                    🛒 הוסף לעגלה
                  </Button>
                  <Button variant="outline-danger">❤️ הוסף למועדפים</Button>
                </div>
                <div className="share-buttons d-flex gap-2 mt-3">
                  <FacebookShareButton url={window.location.href}>
                    <FacebookIcon size={32} round />
                  </FacebookShareButton>
                  <WhatsappShareButton url={window.location.href}>
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* במסך קטן — כפתורי פעולה + כפתורי שיתוף צפים נפרדים */}
      {isMobile && (
        <>
          <div className="product-actions-fixed">
            <Button className="btn btn-success w-100 mb-2" onClick={handleAddToCart}>
              🛒 הוסף לעגלה
            </Button>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span className="text-white mx-2">{quantity}</span>
              <button
                className="btn btn-outline-light btn-sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <Button variant="outline-danger w-100 mb-2">
              ❤️ הוסף למועדפים
            </Button>
          </div>

          <div className="share-fixed-mobile">
            <FacebookShareButton url={window.location.href}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
            <WhatsappShareButton url={window.location.href}>
              <WhatsappIcon size={32} round />
            </WhatsappShareButton>
          </div>
        </>
      )}
    </>
  ) : (
    <p className="text-center mt-5">טוען...</p>
  );
};

export default Product;
