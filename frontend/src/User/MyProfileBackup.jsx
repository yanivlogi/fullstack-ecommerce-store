import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Table, Image, Dropdown, DropdownButton ,Modal  } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';



const Profile = () => {
  const [showImageModal, setShowImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

  const [showFullSizeModal, setShowFullSizeModal] = useState(false);
const [clickedImage, setClickedImage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    password: '',
    verifyPassword: '',
    image: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/userProfile', {
          headers: { Authorization: token },
        });
        setUser(response.data.data);
        setFormData(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('User is not logged in');
    } else {
      getUserProfile();
    }
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const openFullSizeModal = (imageUrl) => {
    setClickedImage(imageUrl);
    setShowFullSizeModal(true);
  };
  
  const closeImageModal = () => {
    setShowImageModal(false);
  };
  
  const checkCurrentPassword = async (currentPassword) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/checkCurrentPassword',
        { currentPassword },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      return response.data.passwordMatch;
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const { currentPassword, password, verifyPassword, ...updatedFormData } = formData;
      
      // Check if currentPassword matches the user's actual password
      const passwordMatch = await checkCurrentPassword(currentPassword);
      
      if (!passwordMatch) {
        console.log("Current password is incorrect.");
        return;
      }
  
      if (password && password !== verifyPassword) {
        console.log("New password and verification password do not match");
        return;
      }
  
      const response = await axios.put(
        'http://localhost:5000/userProfile',
        updatedFormData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser(response.data.data);
      setEditMode(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/userlogin');
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));
};

  


  const handleEditImage = () => {
    setShowOptions(!showOptions);
  };



  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
  
    try {
      const formData = new FormData();
      formData.append('image', file);
  
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:5000/userProfile',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser(response.data.data);
      setShowOptions(false);
    } catch (error) {
      console.error(error);
    }
  };

  const showFullSizeImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };
  

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.delete(
        'http://localhost:5000/userProfile/image',
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setUser(response.data.data);
      setShowOptions(false);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <Container>
      {user ? (
        <Card className="p-3 mb-3" style={{ marginTop: "20px" }}>
          <h1 className="text-center mt-4 mb-4">{user.username}</h1>
          {editMode ? (
            <Form>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="gender">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="dateOfBirth">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="currentPassword">
  <Form.Label>Current Password</Form.Label>
  <Form.Control
    type="password"
    name="currentPassword"
    value={formData.currentPassword}
    onChange={handleChange}
  />
</Form.Group>
              <Form.Group controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="verifyPassword">
                <Form.Label>Verify Password</Form.Label>
                <Form.Control
                  type="password"
                  name="verifyPassword"
                  value={formData.verifyPassword}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="image">
                <Form.Label>Profile Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSave} className="mr-2">
                Save
              </Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Form>
          ) : (
            <>



            <div className="text-center" style={{ position: 'relative' }}>
  <Button
    variant="link"
    onClick={handleEditImage}
    className="position-absolute button-above-image border border-primary"
    style={{
      width: '40px',
      height: '40px',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderRadius: '50%',
      zIndex: 1,
    }}
  >
    <FontAwesomeIcon icon={faEdit} size="lg" />
  </Button>
  <div
  className="rounded-circle border border-primary d-inline-block position-relative"
  style={{
    width: '200px',
    height: '200px',
    overflow: 'hidden',
    zIndex: 0,
  }}
  onClick={() => openFullSizeModal(`http://localhost:5000/${user.image}`)}
>
  <Image
    src={`http://localhost:5000/${user.image}`}
    alt="User Image"
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'cover',
    }}
  />
</div>

  {showOptions && (
  <div className="mt-2">
    <DropdownButton title="Image Options">
      <Dropdown.Item>
        <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
          Upload Image
          <input
            type="file"
            accept="image/*"
            id="imageUpload"
            style={{ display: 'none' }}
            onChange={handleUploadImage}
          />
        </label>
      </Dropdown.Item>
      <Dropdown.Item onClick={handleDeleteImage}>
        Remove Image
      </Dropdown.Item>
      <Dropdown.Item onClick={() => showFullSizeImage(`http://localhost:5000/${user.image}`)}>
        Full Size
      </Dropdown.Item>
    </DropdownButton>
  </div>
)}
<Modal show={showFullSizeModal} onHide={() => setShowFullSizeModal(false)}>
  <Modal.Body>
    <Image
      src={clickedImage}
      alt="Full Size User Image"
      style={{
        width: '100%',
        maxHeight: '70vh', // Limit the height to ensure it fits within the viewport
        objectFit: 'contain',
      }}
    />
  </Modal.Body>
</Modal>


</div>



              <div className="my-3">
                <Table striped bordered hover>
                  <tbody className="text-center" >
                    <tr>
                      <td>{user.name}</td>
                      <td>שם</td>
                    </tr>
                    <tr>
                      <td>{user.email}</td>
                      <td> אימייל</td>
                    </tr>
                    <tr>
                      <td>{user.gender}</td>
                      <td>מין</td>
                    </tr>
                    <tr>
                      <td>{user.dateOfBirth || 'N/A'}</td>
                      <td>תאריך לידה</td>
                    </tr>
                    <tr>
                      <td>{user.phone || 'N/A'}</td>
                      <td>פלאפון</td>
                    </tr>

                  </tbody>
                </Table>
              </div>
              <Button variant="primary" onClick={handleEdit} className="mt-3">
                Edit Details
              </Button>
              <Button variant="danger" onClick={handleLogout} className="ml-2">
                Logout
              </Button>
            </>
          )}
        </Card>
      ) : (
        <Card className="p-3 mb-3">
          <Card.Body>
            <Card.Text>Please log in to view your profile.</Card.Text>
            <Button variant="primary" onClick={() => navigate('/userlogin')}>
              Login
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Profile;