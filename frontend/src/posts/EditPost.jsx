import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [category, setCategory] = useState("");
  const [gender, setGender] = useState("Male");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getPostById();
  }, []);

  const getPostById = async () => {
    try {
      const user_Id = localStorage.getItem("token");

      const response = await axios.get(`http://localhost:5000/posts/${id}`, { user_Id });

      setTitle(response.data.title);
      setCategory(response.data.category);
      setGender(response.data.gender);
      setLocation(response.data.location);
      setType(response.data.type);
      setAge(response.data.age);
      setDescription(response.data.description);
      setName(response.data.name);
      setUserId(user_Id);
      setImage(response.data.image);

      if (response.status === 403) {
        setCanEdit(false);
        setErrorMessage("You do not have permission to edit this post.");
      } else {
        setCanEdit(true);
      }
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
    formData.append("image", image);

    try {
      const response = await axios.put(`http://localhost:5000/posts/${id}`, formData);

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

  if (!canEdit) {
    return <div>{errorMessage}</div>;
  }

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setImage(imageFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };


  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={updatePost}>
          <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Image
              </label>
              <div className="d-flex align-items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="img-thumbnail w-25"
                  />
                ) : image ? (
                  <img
                src={`http://localhost:5000/${image}`}
                alt="preview"
                className="img-thumbnail w-25"
              />
            ) : (
              <div className="w-25">No Image Uploaded</div>
            )}
            <input
              type="file"
              id="image"
              className="form-control-file ms-3"
              accept=".jpg, .jpeg, .png"
              onChange={handleImageChange}
            />
          </div>
        </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                className="form-select"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="type" className="form-label">
                Type
              </label>
              <select
                className="form-select"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">Select a type</option>
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="age" className="form-label">
                Age
              </label>
              <input
                type="number"
                className="form-control"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;