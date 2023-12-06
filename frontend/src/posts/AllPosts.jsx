import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Card, Button, Col, Row, Form, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import { cities } from "../js/cities.js";
import { dogsList } from "../js/dogsList.js";
import { catsList } from "../js/catsList.js";
import { petsList } from "../js/petsList.js";
import { birdsList } from "../js/birdsList.js";
import { reptilesList } from "../js/reptilesList.js";
import { rodentsList } from "../js/rodentsList.js";
import "../css/PostList.css";
import searchBackgroundImage from "../uploads/searchBackgroundImage.jpg"; 




const AllPosts = () => {
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);




  useEffect(() => {
    getPosts();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
    }
  }, [minAge, maxAge]);

  let navigate = useNavigate();

  const getPosts = async () => {
    const orderBy = 'asc';
    const response = await axios.get(`${server_url}/posts`, {
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
    const postsWithVisibility = response.data.map(post => ({ ...post, isOptionsVisible: false }));
    setPosts(postsWithVisibility);
  };


  const getImageUrl = (image) => {
    if (image && image.length > 0) {
      const images = image.split(",");
      const firstImage = images[0].replace(/\\/g, "/"); // Replace backslashes with forward slashes
      const imageUrl = `${server_url}/${firstImage.split("/").pop()}`;
      return imageUrl;
    }
    return ""; // Return an empty string if no image is available
  };


  const handleAdoptButton = async (postId) => {
    try {
      const response = await axios.post(`${server_url}/posts/${postId}/adopt`, {
        isAdopted: true,
      });

      // Refresh the posts after the adoption is successful
      getPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (action) => {
    setShowOptions(false);
    if (action === 'edit') {
      // Redirect to the edit page for the selected post
      navigate(`/edit/${selectedPost._id}`);
    } else if (action === 'delete') {
      // Call the deletePost function with the selected post ID
      deletePost(selectedPost._id);
    } else if (action === 'adopt') {
      // Call the handleAdoptButton function with the selected post ID
      handleAdoptButton(selectedPost._id);
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
      await axios.delete(`${server_url}/posts/${id}`, config);
      window.location.reload(true);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePostClick = (postId) => {
    const selected = posts.find(post => post._id === postId);
    setSelectedPost(selected);
    setPosts(prevPosts => {
      return prevPosts.map(post => {
        if (post._id === postId) {
          return { ...post, isOptionsVisible: !post.isOptionsVisible };
        }
        return { ...post, isOptionsVisible: false }; // Close options menu for other posts
      });
    });
  };


  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return "היום";
    } else {
      return date.toLocaleDateString('he-IL', options);
    }
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
          <Form style={{ backgroundImage:`url(${searchBackgroundImage})` ,backgroundRepeat:"no-repeat",backgroundSize:"cover"}} className="search-form" onSubmit={handleSearch} >
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
        {posts
          .filter(post => !post.isAdopted) // Filter out posts where isAdopt is true
          .map((post, index) => (
          <Col key={post._id} className="mb-3">
            <div className="button-container">
              
              {canEditOrDelete(post.author) && (
                <Button id="options-button" variant="secondary" onClick={() => handlePostClick(post._id)}>
                  ⚙
                </Button>
              )}

             
              {post.isOptionsVisible && (
                <div id="options-menu">
                  <Button variant="primary" onClick={() => handleAction('edit')}>
                    עריכה
                  </Button>
                  <Button variant="danger" onClick={() => handleAction('delete')}>
                    מחיקה
                  </Button>
                  <Button variant="success" onClick={() => handleAction('adopt')}>
                    אימוץ
                  </Button>
                </div>
              )}
              
            </div>
            <Link to={`/posts/${post._id}`} className="post-link">
              <div className="post-card">
              <span style={{ position:"absolute", zIndex:3,  right:"0", backgroundColor:"#6c757d", color:"white", padding:"5px"}}>{formatDate(post.date)}</span>


                <div className="post-name-age">

                  <h3 className="post-name">{post.name}</h3>
                  <p className="post-name">גיל: {post.age}</p>
                  <p className="post-name">מיקום: {post.location}</p>
                  <p className="post-name">
                    {" "}
                    {post.description.length > 30 && !showFullDescription
                      ? `${post.description.slice(0, 30)}... `
                      : post.description}
                    {post.description.length > 30 && !showFullDescription && (
                      <span className="show-more" onClick={() => setShowFullDescription(true)}>
                        הצג יותר
                      </span>
                    )}
                  </p>
                </div>
                <div className="darken-image">
                  <div className="post-details">

                    <div className="post-header">
                    </div>
                    <Link to={`/posts/${post._id}`} className="show-more-link">
                      הצג פרטים נוספים
                    </Link>
                  </div>
                </div>
                <Card className="post-card-image">
                  <Link to={`/posts/${post._id}`}>
                    <Card.Img variant="top" src={getImageUrl(post.image)} className="card-img-top" />
                  </Link>

                </Card>


              </div>
            </Link>
          </Col>
        ))}
      </Row>

    </div>
  );
};

export default AllPosts;