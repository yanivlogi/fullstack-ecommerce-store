import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Card, Button, Col, Row, Form, Container } from "react-bootstrap";
import "../css/MyPosts.css";




const AdoptedPost = () => {
  const [posts, setPosts] = useState([]);
  const [decoded, setDecoded] = useState(null);
  const [image, setImage] = useState("");
  const [isAdopted, setisAdopted] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);




  useEffect(() => {
    getPosts();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
    }
  }, []);

  let navigate = useNavigate();

  const getPosts = async () => {
    const orderBy = 'asc';
    const response = await axios.get(`${server_url}/adoptedPosts`, {
      params: {
        isAdopted: isAdopted,
      },
    });
    const postsWithVisibility = response.data.map(post => ({ ...post, isOptionsVisible: false }));
    setPosts(postsWithVisibility);
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
  const getImageUrl = (image) => {
    if (image && image.length > 0) {
      const images = image.split(",");
      const firstImage = images[0].replace(/\\/g, "/"); // Replace backslashes with forward slashes
      const imageUrl = `${server_url}/${firstImage.split("/").pop()}`;
      return imageUrl;
    }
    return ""; // Return an empty string if no image is available
  };


  return (
    <div className="container mt-5 mb-5">
      <h2 style={{margin:"20px",fontWeight:"bold",color:"red"}}>❤...בעלי חיים שקיבלו הזדמנות שניה❤ </h2>
      {posts.length === 0 ? (
        <div className="text-center mt-5">
          <h3>אין עדיין חיות שאומצו</h3>
          <Link
            style={{ marginBottom: '80px', height: "60px", fontSize: "26px" }}
            to="/addPost"
            className="btn btn-primary"
          >
            ➕ הוסף פוסט חדש
          </Link>
        </div>
      ) : (
        <>

          <Row xs={1} md={2} lg={3} className="g-4">
            {posts
            .filter(post => post.isAdopted) // Filter out posts where isAdopt is true
            .map((post, index) => (
              <Col key={post._id} className="post-card-container">
                {post.isAdopted && (

                  <div className="adopted-message">
                    <p>😃!אומץ</p>
                  </div>
                )}

                <Link to={`/posts/${post._id}`} className="post-link">
                  <div className="post-card">
                  

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
        </>
      )}
    </div>
  );
};

export default AdoptedPost;