import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { cities } from "../js/cities.js";
import { dogsList } from "../js/dogsList.js";
import { catsList } from "../js/catsList.js";
import { petsList } from "../js/petsList.js";
import { birdsList } from "../js/birdsList.js";
import { reptilesList } from "../js/reptilesList.js";
import { rodentsList } from "../js/rodentsList.js";
import "../css/imageCss.css";
import "../css/AddPost.css";

const AddPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("זכר");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [isImmune, setIsImmune] = useState("");
  const [isEducated, setIsEducated] = useState("");
  const [isCastrated, setIsCastrated] = useState("");
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [birds, setBirds] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeLabel, setTypeLabel] = useState("בחר קודם קטגוריה כדי לבחור סוג");
  const [isDragging, setIsDragging] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const AddPost = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("gender", gender);
    formData.append("location", location);
    formData.append("type", type);
    formData.append("age", age);
    formData.append("description", description);
    formData.append("name", name);
    formData.append("userId", userId);
    formData.append("isImmune", isImmune);
    formData.append("isEducated", isEducated);
    formData.append("isCastrated", isCastrated);

    // Append each image file separately
    images.forEach((image) => {
      formData.append("image[]", image);
    });

    try {
      await axios.post(`${server_url}/posts`, formData);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedImages]);
  };

  const handleUploadClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedImages = Array.from(e.dataTransfer.files);
    setImages((prevImages) => [...prevImages, ...droppedImages]);
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === "כלבים") {
      setTypeOptions(dogsList);
      setTypeLabel("בחר סוג כלב");
    } else if (selectedCategory === "חתולים") {
      setTypeOptions(catsList);
      setTypeLabel("בחר סוג חתול");
    } else if (selectedCategory === "תוכים ובעלי כנף") {
      setTypeOptions(birdsList);
      setTypeLabel("בחר סוג ציפורים");
    } else if (selectedCategory === "מכרסמים") {
      setTypeOptions(rodentsList);
      setTypeLabel("בחר סוג מכרסמים");
    } else if (selectedCategory === "זוחלים") {
      setTypeOptions(reptilesList);
      setTypeLabel("בחר סוג זוחלים");
    } else {
      setTypeOptions([]);
      setTypeLabel("בחר סוג אחר");
    }
  };

  return (
    <div className="container my-5">
      {isLoggedIn ? (
        <div className="row" id="add-post-row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-center mb-4" >הוספת בעל חיים</h1>
                <form onSubmit={AddPost}>
                  <div className="form-group" >
                    <label htmlFor="name">שם בעל החייים</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="הזן שם"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">קטגוריה</label>
                    <select
                      className="form-control"
                      id="category"
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      required
                    >
                      <option value="">בחר קטגורית חיית מחמד</option>
                      {petsList.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">{typeLabel}</label>

                    <select
                      className="form-control"
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      <option value="">Select type</option>
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">מין</label>
                    <select
                      className="form-control"
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="זכר">זכר</option>
                      <option value="נקבה">נקבה</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="isImmune"> ?האם אני מחוסן/ת</label>
                    <select
                      className="form-control"
                      id="isImmune"
                      value={isImmune}
                      onChange={(e) => setIsImmune(e.target.value)}
                      required
                    >
                      <option value="false">לא</option>
                      <option value="true">כן</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="isEducated">?מחונך לצרכים</label>
                    <select
                      className="form-control"
                      id="isEducated"
                      value={isEducated}
                      onChange={(e) => setIsEducated(e.target.value)}
                      required
                    >
                      <option value="false">לא</option>
                      <option value="true">כן</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="isCastrated">? מסורס / מעוקרת </label>
                    <select
                      className="form-control"
                      id="isCastrated"
                      value={isCastrated}
                      onChange={(e) => setIsCastrated(e.target.value)}
                      required
                    >
                      <option value="false">לא</option>
                      <option value="true">כן</option>


                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="location">איזור איסוף</label>
                    <select
                      className="form-control"
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    >
                      <option value="">בחר מיקום</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="age">גיל (בשנים)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="age"
                      value={age}
                      onChange={(e) => setAge(Math.max(parseFloat(e.target.value), 0.1))}
                      placeholder="Enter age"
                      step="0.1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">קצת על בעל החיים</label>
                    <textarea
                      className="form-control"
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="כתוב קצת על בעל החיים"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <small className="text-muted">
                      (You can select multiple images)
                    </small>
                    <div
                      className={`input-group mb-3 ${isDragging ? "dragging" : ""
                        }`}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    >
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="imageInput"
                          onChange={handleImageChange}
                          multiple
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="image"
                          onClick={handleUploadClick}
                        >
                          {isDragging
                            ? "Drop image here 🔽"
                            : images.length === 0
                              ? "Choose file 🖼"
                              : "Upload more files ➕"}
                        </label>
                      </div>
                    </div>
                    {images.length > 0 && (
                      <div className="image-preview">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="image-item position-relative"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Image ${index + 1}`}
                              className="preview-image img-thumbnail"
                              style={{ width: "200px" }}
                            />
                            <button
                              className="remove-button"
                              onClick={() => removeImage(index)}
                            >
                              <span
                                style={{
                                  fontSize: "18px",
                                  fontWeight: "bold",
                                }}
                              >
                                ✖
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-4"
                  >
                    הוסף פוסט
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-danger">
          You need to be logged in to add a post.{" "}
          <Link to="/userLogin" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

export default AddPost;
