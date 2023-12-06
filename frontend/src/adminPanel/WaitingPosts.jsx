import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Card, Button, Col, Row, Form, Container, Tooltip, OverlayTrigger } from "react-bootstrap";
import "../css/PostList.css";




const WaitingPosts = () => {
  const [posts, setPosts] = useState([]);
  const [decoded, setDecoded] = useState(null);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);




  useEffect(() => {
    getWaitingPosts();
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      setDecoded(decodedToken);
    }
  }, []);

  let navigate = useNavigate();

  const getWaitingPosts = async () => {
    const response = await axios.get(`${server_url}/getWaitingPosts`);
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


  const handlePostConfirmationButton = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
  
      const response = await axios.post(
        `${server_url}/${postId}/postConfirmation`,
        { isConfirmed: true }, // Removed unnecessary "config" key
        config
      );
  
      // Refresh the posts after the adoption is successful
      getWaitingPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAction = (action) => {
    setShowOptions(false);
    if (action === 'edit') {
      // Redirect to the edit page for the selected post
      navigate(`/edit/${selectedPost._id}`);
    } else if (action === 'reject') {
      // Call the handlePostRejectionButton function with the selected post ID
      handlePostRejectionButton(selectedPost._id);
    } else if (action === 'confirm') {
      // Call the handlePostConfirmationButton function with the selected post ID
      handlePostConfirmationButton(selectedPost._id);
    }
  };


  const handlePostRejectionButton = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token,
        },
      };
  
      // Note: Use axios.delete for DELETE requests and move the rejectionReason to the params
      const response = await axios.delete(
        `${server_url}/${postId}/rejectPost`,
        {
          params: { rejectionReason: "Your rejection reason here" }, // Pass rejectionReason as a query parameter
          headers: {
            Authorization: token,
          },
        }
      );
  
      // Refresh the posts after the rejection is successful
      getWaitingPosts();
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


 
 
  return (
    <div className="container mt-5 mb-5">
        <h2>פוסטים שממתינים לאישור מנהל</h2>
        {posts.length === 0 ? (
          <p style={{textAlign:"center", fontSize:"18px"}}>אין כרגע פוסטים שממתינים לאישור</p>
          ) : (
      <Row xs={1} md={2} lg={3} className="g-4">
        {posts
          .filter(post => !post.isAdopted) // Filter out posts where isAdopt is true
          .map((post, index) => (
          <Col key={post._id} className="mb-3">
            <div className="button-container">
              
            
                <Button id="options-button" variant="secondary" onClick={() => handlePostClick(post._id)}>
                  ⚙
                </Button>
             

             
              {post.isOptionsVisible && (
                <div id="options-menu">
                  <Button variant="primary" onClick={() => handleAction('edit')}>
                    עריכה
                  </Button>
                  <Button variant="danger" onClick={() => handleAction('reject')}>
                    דחייה
                  </Button>
                  <Button variant="success" onClick={() => handleAction('confirm')}>
                    אישור
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
 )}
    </div>
  );
};

export default WaitingPosts;