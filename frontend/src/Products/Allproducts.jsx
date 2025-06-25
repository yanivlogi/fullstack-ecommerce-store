import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar.jsx";
import { vegetableCategories } from "../js/vegetableCategories.js";
import { leafyList } from "../js/leafyList.js";
import { rootList } from "../js/rootList.js";
import { fruitList } from "../js/fruitList.js";
import { useCart } from "../context/CartContext";
import "../css/AllProducts.css";

const AllProducts = ({ onOpenCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [addedToCart, setAddedToCart] = useState({});
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { addToCart } = useCart();
  const server_url = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    const token = localStorage.getItem("token");
    if (token) {
      setDecoded(jwt_decode(token));
    }

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProducts = async () => {
    try {
      const query = {};
      if (searchQuery) query.search = searchQuery;
      if (category) query.category = category;
      if (type) query.type = type;
      if (minPrice > 0) query.minPrice = minPrice;
      if (maxPrice > 0) query.maxPrice = maxPrice;

      const res = await axios.get(`${server_url}/products`, { params: query });
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (error) {
      console.error("שגיאה בהבאת המוצרים:", error);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (category) result = result.filter((p) => p.category === category);
    if (type) result = result.filter((p) => p.type === type);
    if (searchQuery)
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (minPrice) {
      result = result.filter((p) => {
        const effectivePrice = p.priceSale > 0 ? p.priceSale : p.price;
        return effectivePrice >= parseFloat(minPrice);
      });
    }

    if (maxPrice) {
      result = result.filter((p) => {
        const effectivePrice = p.priceSale > 0 ? p.priceSale : p.price;
        return effectivePrice <= parseFloat(maxPrice);
      });
    }

    setFilteredProducts(result);
  }, [products, category, type, searchQuery, minPrice, maxPrice]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    switch (selectedCategory) {
      case "ירקות עליים":
        setTypeOptions(leafyList);
        break;
      case "ירקות שורש":
        setTypeOptions(rootList);
        break;
      case "ירקות פירות":
        setTypeOptions(fruitList);
        break;
      default:
        setTypeOptions([]);
    }
  };

  const getImageUrl = (imagesStr) => {
    if (!imagesStr) return "";
    const firstPath = imagesStr.split(",")[0]?.trim();
    const cleanPath = firstPath.replace(/^uploads[\\/]/, "");
    return `${server_url}/${cleanPath}`;
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    const price = product.priceSale > 0 ? product.priceSale : product.price;

    addToCart({
      _id: product._id,
      name: product.name,
      price,
      quantity,
      image: getImageUrl(product.images),
    });

    if (onOpenCart) onOpenCart(); // 🟢 פתיחת עגלה

    // 🟡 אנימציה
    setAddedToCart((prev) => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product._id]: false }));
    }, 800);
  };

  return (
    <div className="products-page">
      <FilterSidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        category={category}
        type={type}
        searchQuery={searchQuery}
        minPrice={minPrice}
        maxPrice={maxPrice}
        categories={vegetableCategories}
        typeOptions={typeOptions}
        setCategory={handleCategoryChange}
        setType={setType}
        setSearchQuery={setSearchQuery}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        handleSearch={getProducts}
      />

      <section className="product-grid">
        {filteredProducts.map((product) => (
          <div className="product-card" key={product._id}>
            {product.priceSale > 0 && <div className="sale-tag">מבצע!</div>}
            <div className="product-image">
              <img src={getImageUrl(product.images)} alt={product.name} />
            </div>
            <h3>{product.name}</h3>
            <p className="desc">{product.description?.slice(0, 50)}...</p>
            <div className="price-row">
              {product.priceSale > 0 ? (
                <>
                  <span className="price-discounted">₪{product.priceSale}</span>
                  <span className="price-original discounted">₪{product.price}</span>
                </>
              ) : (
                <span className="price-original">₪{product.price}</span>
              )}
            </div>
            <div className="actions">
              <button
                className={`add-btn ${addedToCart[product._id] ? "added" : ""}`}
                onClick={() => handleAddToCart(product)}
              >
                {addedToCart[product._id] ? "✔ נוסף!" : "הוסף"}
              </button>
              <div className="quantity-box">
                <button onClick={() => decreaseQuantity(product._id)}>-</button>
                <span>{quantities[product._id] || 1}</span>
                <button onClick={() => increaseQuantity(product._id)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AllProducts;
