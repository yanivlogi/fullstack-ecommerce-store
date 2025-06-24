import React, { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/FilterSidebar";
import { cities } from "../js/cities.js";
import { dogsList } from "../js/dogsList.js";
import { catsList } from "../js/catsList.js";
import { petsList } from "../js/petsList.js";
import { birdsList } from "../js/birdsList.js";
import { reptilesList } from "../js/reptilesList.js";
import { rodentsList } from "../js/rodentsList.js";
import "../css/AllProducts.css";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isEducated, setIsEducated] = useState("");
  const [isCastrated, setIsCastrated] = useState("");
  const [isImmune, setIsImmune] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(99);
  const [quantities, setQuantities] = useState({});
  const [sidebarPosition, setSidebarPosition] = useState("closed");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSidebarOpen, setSidebarOpen] = useState(false);



  const server_url = process.env.REACT_APP_SERVER_URL;
  const navigate = useNavigate();

  const getPosts = async () => {
    try {
      const res = await axios.get(`${server_url}/posts`, {
        params: {
          search: searchQuery,
          category,
          type,
          gender: selectedGender,
          location: selectedLocation,
          isImmune,
          isEducated,
          isCastrated,
          minAge,
          maxAge,
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
    if (selectedGender) result = result.filter((p) => p.gender === selectedGender);
    if (selectedLocation) result = result.filter((p) => p.location === selectedLocation);
    if (isEducated) result = result.filter((p) => p.isEducated?.toString() === isEducated);
    if (isCastrated) result = result.filter((p) => p.isCastrated?.toString() === isCastrated);
    if (isImmune) result = result.filter((p) => p.isImmune?.toString() === isImmune);
    if (searchQuery) result = result.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (minAge) result = result.filter((p) => p.age >= parseInt(minAge));
    if (maxAge) result = result.filter((p) => p.age <= parseInt(maxAge));
    setFilteredPosts(result);
  }, [
    posts, category, type, selectedGender, selectedLocation,
    isEducated, isCastrated, isImmune, searchQuery, minAge, maxAge
  ]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    switch (selectedCategory) {
      case "כלבים": setTypeOptions(dogsList); break;
      case "חתולים": setTypeOptions(catsList); break;
      case "תוכים ובעלי כנף": setTypeOptions(birdsList); break;
      case "מכרסמים": setTypeOptions(rodentsList); break;
      case "זוחלים": setTypeOptions(reptilesList); break;
      default: setTypeOptions([]);
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
  selectedGender={selectedGender}
  selectedLocation={selectedLocation}
  searchQuery={searchQuery}
  isEducated={isEducated}
  isCastrated={isCastrated}
  isImmune={isImmune}
  minAge={minAge}
  maxAge={maxAge}
  petsList={petsList}
  typeOptions={typeOptions}
  cities={cities}
  setCategory={handleCategoryChange}
  setType={setType}
  setSelectedGender={setSelectedGender}
  setSelectedLocation={setSelectedLocation}
  setSearchQuery={setSearchQuery}
  setIsEducated={setIsEducated}
  setIsCastrated={setIsCastrated}
  setIsImmune={setIsImmune}
  setMinAge={setMinAge}
  setMaxAge={setMaxAge}
  handleSearch={getPosts}
/>



      <section className="product-grid">
        {filteredPosts.filter((post) => !post.isAdopted).map((post) => (
          <div className="product-card" key={post._id}>
            <div className="sale-tag">מבצע!</div>
            <div className="product-image">
              <img src={getImageUrl(post.image)} alt={post.name} />
            </div>
            <h3>{post.name}</h3>
            <p className="desc">{post.description?.slice(0, 50)}...</p>
            <div className="price-row">
              <span className="price-discounted">₪10</span>
              <span className="price-original">₪19.9</span>
            </div>
            <div className="expiry">עד: {formatDate(post.expiryDate)}</div>
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