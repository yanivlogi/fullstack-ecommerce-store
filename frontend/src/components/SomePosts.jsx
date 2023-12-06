import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';
import "../css/SomePosts.css"

const SomePosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);

  useEffect(() => {
    setIsLoading(true); // Set loading state to true
    getSomePosts();
  }, []);

  const getImageUrl = (image) => {
    if (image && image.length > 0) {
      const images = image.split(",");
      const firstImage = images[0].replace(/\\/g, "/"); // Replace backslashes with forward slashes
      const imageUrl = `${server_url}/${firstImage.split("/").pop()}`;
      return imageUrl;
    }
    return ""; // Return an empty string if no image is available
  };

  const getSomePosts = async () => {
    try {
      const response = await axios.get(`${server_url}/somePosts`);
      setPosts(response.data);
      setIsLoading(false); // Set loading state to false after receiving posts
    } catch (error) {
      console.log(error);
      setIsLoading(false); // Set loading state to false in case of an error
    }
  };

  return (
    <>
    <div className="SomePosts">
      {isLoading ? ( // Check if loading state is true
        <div className="px-3">
          <div className="text-center" style={{ padding: '30px' }}>
            <Spinner animation="border" variant="primary" role="status" />
            <div className="h3 text-primary mt-3">Loading...</div>
          </div>
        </div>
      ) : (
        <> <h2>🐾אמצו אותנו🐾</h2>
          <Container style={{ display: 'flex', flexDirection: 'row-reverse', flexWrap: 'wrap', textAlign: 'center', justifyContent: 'center' }}>
           
          {posts.map((post) => (
  // Check if post is confirmed before rendering
  post.isConfirmed && (
    <Card key={post._id} style={{ width: '10rem', borderStyle:'solid' , borderColor:'blue' ,  margin:'1px' }}>
      <Link to={`/posts/${post._id}`}>
        <Card.Img variant="top" src={getImageUrl(post.image)} style={{ objectFit: 'cover', height: '10rem' }} />
        <Card.Body style={{ direction: 'rtl' }}>
          <Card.Title style={{ color: '#00b6ff' }}>{post.name}</Card.Title>
          <Card.Text>קטגוריה: {post.category}</Card.Text>
          <Card.Text>גיל: {post.age}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  )
))}
          </Container>
         
        </>
      )}
    </div>
     <div style={{ width: "100%", fontSize: "26px", textAlign: "center" }}>
     <Link to="/AllPosts" className="btn btn-primary" style={{ width: "100%", fontSize: '20px' }}>
       ...הצג/י הכל
     </Link>
   </div>
   </>
  );
};

export default SomePosts;
