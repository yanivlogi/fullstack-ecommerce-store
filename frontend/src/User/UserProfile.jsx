import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams , Link} from 'react-router-dom';
import { Container, Card, Button, Form, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faGlobe, faEnvelope , faPhone , faCakeCandles } from '@fortawesome/free-solid-svg-icons';

import "../css/UserProfile.css"

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${server_url}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = response.data;
      if (userData.redirectTo) 
      {
        navigate(userData.redirectTo);
      } else 
      {
        setUser(userData);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong while fetching the user.');
      setUser(null);
    }
  };
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  

  const handleImageClick = () => {
    setShowModal(true); // Show modal when the image is clicked
  };

  if (!user) {
    return <div className="user-profile-text-center">User does not exist.</div>;
  }


  return (
    <div>

       <Container className="user-profile-container">
    <Card className="user-profile-card">
      <Card.Body className="user-profile-card-body">
        <Card.Title className="user-profile-card-title">{user.username}</Card.Title>
        <div className="user-profile-image-container" onClick={handleImageClick}>
          <div className="user-profile-image-overlay"></div>
          <img src={`${server_url}${user.image}`} alt="Profile" className="user-profile-card-img" />
        </div>
        <table className="user-profile-table">
            <tbody>
              <tr>
                <td style={{textAlign:'center'}}>{user.name}</td>
                <td><strong> : שם </strong></td>
              </tr>
              <tr>
              <td>
  {user.phone ? (
    <>
      {user.isNumberShow ? (
        <span className="public-phone">
          <FontAwesomeIcon icon={faPhone} />&nbsp;
           {user.phone}
        </span>
      ) : (
        <span className="private-phone">
          <FontAwesomeIcon icon={faLock} />&nbsp;
          מספר פרטי
        </span>
      )}
    </>
  ) : (
    'N/A'
  )}
</td>

        <td><strong> : פלאפון</strong></td>
      </tr>
              <tr>
               
                <td>
  {user.email ? (
    <>
      {user.isEmailShow ? (
        <span className="public-phone">
          <FontAwesomeIcon icon={faEnvelope} />&nbsp;
            {user.email}
        </span>
      ) : (
        <span className="private-phone">
          <FontAwesomeIcon icon={faLock} />&nbsp;
          דוא"ל פרטי
        </span>
      )}
    </>
  ) : (
    'N/A'
  )}
</td>         
<td><strong> : אימייל</strong></td>     
</tr>
              <tr>
              
                <td>
  {user.dateOfBirth ? (
    <>
      {user.isBirthDateShow ? (
        <span className="public-phone">  <FontAwesomeIcon icon={faCakeCandles} />&nbsp; {formatDate(user.dateOfBirth)}</span>
      ) : (
        <span className="private-phone">
          <FontAwesomeIcon icon={faLock} />&nbsp;
          תאריך לידה פרטי
        </span>
      )}
    </>
  ) : (
    'N/A'
  )}
</td>
<td><strong> : תאריך לידה</strong></td>
              </tr>
            </tbody>
          </table>
          <Link className="user-profile-link" to={`/sendmessage/${id}`}>
            send message ✉
          </Link>
        </Card.Body>
      </Card>
      {/* Modal for displaying the full-size image */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img
            src={`${server_url}${user.image}`}
            alt="Profile"
            style={{ width: '100%', height: 'auto' }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>



    </div>
   
  );
};

export default UserProfile;