import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import { vegetableCategories } from "../js/vegetableCategories.js";
import { leafyList } from "../js/leafyList.js";
import { rootList } from "../js/rootList.js";
import { fruitList } from "../js/fruitList.js";
import "../css/AllProducts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [quantities, setQuantities] = useState({});
  const [sidebarPosition, setSidebarPosition] = useState("closed");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setSidebarOpen] = useState(false);



  const server_url = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      const res = await axios.get(`${server_url}/products`, {
        params: {
          search: searchQuery,
          category,
          type,
          minPrice,
          maxPrice,
        },
      });
      setPosts(res.data);
      setFilteredPosts(res.data);
    } catch (error) {
      console.error("שגיאה בהבאת הפוסטים:", error);
    }
  };

  useEffect(() => {
    getPosts();
    const token = localStorage.getItem("token");
    if (token) {
      setDecoded(jwt_decode(token));
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let result = [...posts];
    if (category) result = result.filter((p) => p.category === category);
    if (type) result = result.filter((p) => p.type === type);
    if (searchQuery) result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (minPrice) result = result.filter((p) => p.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= parseFloat(maxPrice));
    setFilteredPosts(result);
  }, [
    posts, category, type, searchQuery, minPrice, maxPrice
  ]);

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

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("he-IL");


const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const firstPath = imagePath.split(",")[0]?.trim();
  const cleanPath = firstPath.replace(/^uploads[\\/]/, "/");
  return `${server_url}/${cleanPath}`;
};
  const addToCart = (id) => setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  const decreaseQuantity = (id) => setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));

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
  handleSearch={getPosts}
/>



      <section className="product-grid">
        {filteredPosts.map((post) => (
          <div className="product-card" key={post._id}>
            <div className="sale-tag">מבצע!</div>
            <div className="product-image">
              <img src={getImageUrl(post.image)} alt={post.name} />
            </div>
            <h3>{post.name}</h3>
            <p className="desc">{post.description?.slice(0, 50)}...</p>
            <div className="price-row">
              {post.priceSale && (
                <span className="price-discounted">₪{post.priceSale}</span>
              )}
              <span className="price-original">₪{post.price}</span>
            </div>
            <div className="actions">
              <button className="add-btn" onClick={() => addToCart(post._id)}>הוסף</button>
              <div className="quantity-box">
                <button onClick={() => decreaseQuantity(post._id)}>-</button>
                <span>{quantities[post._id] || 1}</span>
                <button onClick={() => addToCart(post._id)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AllPosts;