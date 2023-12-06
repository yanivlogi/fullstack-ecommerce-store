import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { cities } from "../js/cities.js";
import { dogsList } from "../js/dogsList.js";
import { catsList } from "../js/catsList.js";
import { petsList } from "../js/petsList.js";
import { birdsList } from "../js/birdsList.js";
import { reptilesList } from "../js/reptilesList.js";
import { rodentsList } from "../js/rodentsList.js";

const EditPost = () => {
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
  const [removedImageIndices, setRemovedImageIndices] = useState([]);

  const [currentImages, setCurrentImages] = useState([]);
  const [updateImages, setUpdateImages] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [birds, setBirds] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeLabel, setTypeLabel] = useState("בחר קודם קטגוריה כדי לבחור סוג");
  const [isDragging, setIsDragging] = useState(false);
  const [userId, setUserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getPostById();
  }, []);

  const getPostById = async () => {
    try {
      const user_Id = localStorage.getItem("token");
      const response = await axios.get(`${server_url}/posts/${id}`, { user_Id });
      const postData = response.data;
      setTitle(response.data.title);
      setCategory(response.data.category);
      setGender(response.data.gender);
      setLocation(response.data.location);
      setType(response.data.type);
      setAge(response.data.age);
      setDescription(response.data.description);
      setName(response.data.name);
      setUserId(user_Id);
      setIsImmune(response.data.isImmune);
      setIsEducated(response.data.isEducated);
      setIsCastrated(response.data.isCastrated);

      var imagePaths = response.data.image.split(",").map((path) => server_url + path.replace('uploads\\', "/"));
      const currentImagesArray = imagePaths.map((path) => ({
        file: null, // Set the file property to null for current images
        path: path, // Set the path property for displaying the image
        isNew: false, // Flag indicating it's a current image
      }));
      setCurrentImages(currentImagesArray); // Set the current images state
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

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
    formData.append("removedImageIndices", JSON.stringify(removedImageIndices));


    updateImages.forEach((image) => {
      formData.append("image[]", image.file);
    });



    try {
      const response = await axios.put(`${server_url}/posts/${id}`, formData);

      if (response.status === 200) {

        setErrorMessage("");
        navigate("/");
      } else if (response.status === 403) {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeCurrentImage = (index, e) => {
    e.preventDefault(); // Prevent the default button click behavior
    setCurrentImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setRemovedImageIndices((prevIndices) => [...prevIndices, index]);
  };


  const removeImage = (index) => {
    updateImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files).map((file) => ({
      file: file,
      path: URL.createObjectURL(file),
      isNew: true,
    }));
    setUpdateImages((prevImages) => [...prevImages, ...selectedImages]);

  };


  const handleUploadClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedImages = Array.from(e.dataTransfer.files);
    updateImages((prevImages) => [...prevImages, ...droppedImages]);
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
    <div className="container mt-5">
      {isLoggedIn ? (
        <div className="row" id="add-post-row">
          <div className="col-md-6 mx-auto">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-center mb-4" >עריכת פוסט</h1>
                <form onSubmit={updatePost}>
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
                      <option value={type}>{type}</option>
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
                            : updateImages.length === 0
                              ? "Choose file 🖼"
                              : "Upload more files ➕"}
                        </label>
                      </div>
                    </div>
                    {currentImages.map((image, index) => {
                      if (image.path !== `${server_url}/defaultImage.png`) {
                        return (
                          <div key={index} className="image-item position-relative">
                            <img
                              src={image.path}
                              alt={`Current Image ${index + 1}`}
                              className="preview-image img-thumbnail"
                              style={{ width: "200px" }}
                            />
                            <button
                              className="remove-button"
                              onClick={(e) => removeCurrentImage(index, e)}
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
                        );
                      } else {
                        return null; // Do not render defaultImage.png
                      }
                    })}

                    {updateImages.length > 0 && (
                      <div className="image-preview">
                        {updateImages.map((image, index) => (
                          <div key={index} className="image-item position-relative">
                            <img
                              src={image.path}
                              alt={`New Image ${index + 1}`}
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
export default EditPost;