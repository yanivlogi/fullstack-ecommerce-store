import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Card, Button, Col, Row, Form, Container } from "react-bootstrap";
import { cities } from "../../js/cities.js";
import { dogsList } from "../../js/dogsList.js";
import { catsList } from "../../js/catsList.js";
import { petsList } from "../../js/petsList.js";
import { birdsList } from "../../js/birdsList.js";
import { reptilesList } from "../../js/reptilesList.js";
import { rodentsList } from "../../js/rodentsList.js";
import "../../css/PostList.css";




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

      <Row>
        <Col>
          <Form className="search-form" onSubmit={handleSearch}>
            <Container>
              <h2>חיפוש</h2>
              <Row>
                <Col xs={12} md={3}>
                  <Form.Group controlId="category">
                    <Form.Label>קטגוריה:</Form.Label>
                    <Form.Select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      <option value="">הכל</option>
                      {petsList.map((pet) => (
                        <option key={pet} value={pet}>
                          {pet}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="type">
                    <Form.Label>סוג:</Form.Label>
                    <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                      <option value="">בחר סוג</option>
                      {typeOptions.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="gender">
                    <Form.Label>מין:</Form.Label>
                    <Form.Select
                      value={selectedGender}
                      onChange={(e) => setSelectedGender(e.target.value)}
                    >
                      <option value="">הכל</option>
                      <option value="זכר">זכר</option>
                      <option value="נקבה">נקבה</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="location">
                    <Form.Label>מיקום:</Form.Label>
                    <Form.Select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    >
                      <option value="">הכל</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="isEducated">
                    <Form.Label>מחונך לצרכים :</Form.Label>
                    <Form.Select
                      value={isEducated}
                      onChange={(e) => setIsEducated(e.target.value)}
                    >
                      <option value="">הכל</option>
                      <option value="false">לא</option>
                      <option value="true">כן</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="isCastrated">
                    <Form.Label>  מסורס / מעוקרת :</Form.Label>
                    <Form.Select
                      value={isCastrated}
                      onChange={(e) => setIsCastrated(e.target.value)}
                    >
                      <option value="">הכל</option>
                      <option value="false">לא</option>
                      <option value="true">כן</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={3}>
                  <Form.Group controlId="isImmune">
                    <Form.Label>מחוסן/ת:</Form.Label>
                    <Form.Select
                      value={isImmune}
                      onChange={(e) => setIsImmune(e.target.value)}
                    >
                      <option value="">הכל</option>
                      <option value="false">לא</option>
                      <option value="true">כן</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Row className="align-items-center">
        <Col xs={12} md={6}>
          <Form.Group controlId="minAge">
            <Form.Label>גיל מינימלי:</Form.Label>
            <Form.Control
              type="number"
              value={minAge}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setMinAge(value);
                }
              }}
              className="small-input" // Custom CSS class for smaller input width
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="maxAge">
            <Form.Label>גיל מקסימלי:</Form.Label>
            <Form.Control
              type="number"
              value={maxAge}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0) {
                  setMaxAge(value);
                }
              }}
              className="small-input" // Custom CSS class for smaller input width
            />
          </Form.Group>
        </Col>
      </Row>

              </Row>

              <Row className="search-row">
                <Col className="search-col">
                  <Form.Group controlId="search">
                    <Form.Label>חיפוש:</Form.Label>
                    <Form.Control
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col className="search-col">
                  <Button variant="primary" type="submit">
                    חיפוש
                  </Button>
                </Col>
              </Row>
            </Container>

          </Form>
        </Col>
        <Link
          style={{ marginBottom: '80px', height: "60px", fontSize: "26px" }}
          to="/addPost"
          className="btn btn-primary"
        >
          ➕ הוסף פוסט חדש
        </Link>
      </Row>
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