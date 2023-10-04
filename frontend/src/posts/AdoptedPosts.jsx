import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Card, Button, Col, Row, Form, Container } from "react-bootstrap";
import { cities } from "../js/cities.js";
import { dogsList } from "../js/dogsList.js";
import { catsList } from "../js/catsList.js";
import { petsList } from "../js/petsList.js";
import { birdsList } from "../js/birdsList.js";
import { reptilesList } from "../js/reptilesList.js";
import { rodentsList } from "../js/rodentsList.js";
import "../css/PostList.css";




const AdoptedPost = () => {
  const [posts, setPosts] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [typeLabel, setTypeLabel] = useState("בחר קודם קטגוריה כדי לבחור סוג");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");
  const [isImmune, setIsImmune] = useState("");
  const [isEducated, setIsEducated] = useState("");
  const [isCastrated, setIsCastrated] = useState("");
  const [isAdopted, setisAdopted] = useState("");
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(99);




  useEffect(() => {
    getPosts();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
    }
  },[minAge, maxAge]);

  let navigate = useNavigate();

  const getPosts = async () => {
    const orderBy = 'asc';
    const response = await axios.get("http://localhost:5000/posts", {
      params: {
        search: searchQuery,
        category: category,
        type: type,
        gender: selectedGender,
        location: selectedLocation,
        isImmune: isImmune,
        isEducated: isEducated,
        isCastrated: isCastrated,
        isAdopted: isAdopted,
        minAge,
        maxAge,
        


      },
    });
    const filteredPosts = response.data.filter((post) => post.isAdopted);

    setPosts(filteredPosts);
  };
  const getImageUrl = (image) => {
    if (image && image.length > 0) {
      const images = image.split(",");
      const firstImage = images[0].replace(/\\/g, "/"); // Replace backslashes with forward slashes
      const imageUrl = `http://localhost:5000/${firstImage.split("/").pop()}`;
      return imageUrl;
    }
    return ""; // Return an empty string if no image is available
  };


  const handleAdoptButton = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:5000/posts/${postId}/adopt`, {
        isAdopted: true,
      });

      // Refresh the posts after the adoption is successful
      getPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);

    if (selectedCategory === "כלבים") {
      setTypeOptions(dogsList);
      setTypeLabel("בחר סוג כלב");
    }
    else if (selectedCategory === "חתולים") {
      setTypeOptions(catsList);
      setTypeLabel("בחר סוג חתול");
    }
    else if (selectedCategory === "תוכים ובעלי כנף") {
      setTypeOptions(birdsList);
      setTypeLabel("בחר סוג ציפורים");
    }
    else if (selectedCategory === "מכרסמים") {
      setTypeOptions(rodentsList);
      setTypeLabel("בחר סוג מכרסמים");
    }
    else if (selectedCategory === "זוחלים") {
      setTypeOptions(reptilesList);
      setTypeLabel("בחר סוג זוחלים");
    }
    else {
      setTypeOptions([]);
      setTypeLabel("בחר סוג אחר");
    }
  };
  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
      await axios.delete(`http://localhost:5000/posts/${id}`, config);
      window.location.reload(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const canEditOrDelete = (postUserId) => {
    if (decoded && decoded.id) {
      const userId = decoded.id;
      return userId === postUserId;
    }
    return false;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getPosts();
  };

  return (
   
    <div className="container mt-5 mb-5">
      <h1 className="title-text-pets-get-live">Animals Granted a Second Lease On Life</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts.map((post, index) => (
          <Col key={post._id} className="mb-3">
            <Card style={{ height: "100%" }}>
              <Card.Img
                variant="top"
                src={getImageUrl(post.image)}
                style={{ height: "15rem", objectFit: "cover", cursor: "pointer" }}
                onClick={() => handlePostClick(post._id)}
              />
              <Card.Body style={{ direction: 'rtl' }}>
                <Card.Title>שם : {post.name}</Card.Title>
                <Card.Text>גיל : {post.age} </Card.Text>
                <Card.Text>מיקום : {post.location}</Card.Text>
              </Card.Body>
              <Card.Footer style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                {canEditOrDelete(post.author) && (
                  <>
                    <Link
                      to={`/edit/${post._id}`}
                      className="btn btn-primary"
                      style={{ fontSize: '15px', marginRight: '5px' }}
                    >
                      📝
                    </Link>
                    
                      <Button
                        onClick={() => handleAdoptButton(post._id)}
                        className="btn btn-success"
                        style={{ fontSize: '15px' }}
                      >
                        אמץ
                      </Button>
                    
                    <Button
                      onClick={() => deletePost(post._id)}
                      className="btn btn-danger"
                      style={{ fontSize: '15px' }}
                    >
                      🗑
                    </Button>
                  </>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}

      </Row>
    </div>
  );
};

export default AdoptedPost;