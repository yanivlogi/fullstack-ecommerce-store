import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Table, Image, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faLock, faGlobe } from '@fortawesome/free-solid-svg-icons';

import "../css/MyProfile.css";




const Profile = () => {
  const [isPasswordConfirmed, setIsPasswordConfirmed] = useState(false);

  const [newImage, setNewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showFullSizeModal, setShowFullSizeModal] = useState(false);
  const [clickedImage, setClickedImage] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState(''); // Add this line
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    phone: '',
    password: '',
    verifyPassword: '',
    isNumberShow:'',
    isEmailShow:'',
    isBirthDateShow:'',
    image: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${server_url}/userProfile`, {
          headers: { Authorization: token },
        });
        setUser(response.data.data);
        setFormData(response.data.data);
      } catch (error) {
        console.error(error);
        // Handle errors and display user-friendly messages
      }
    };
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setNewImage(URL.createObjectURL(file));
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      console.log('User is not logged in');
    } else {
      getUserProfile();
    }
  }, []);

  const handleEdit = async () => {
    // Check if the user is already in edit mode or if the password is confirmed
    if (!editMode && !isPasswordConfirmed) {
      // If not, show a modal or a prompt to enter the current password
      const enteredPassword = prompt("Enter your current password:");

      // Check if the entered password is empty
      if (enteredPassword.trim() === "") {
        alert("Password input is empty.");
      } else {
        // Call a function to check the entered password on the server
        await checkCurrentPassword(enteredPassword)
          .then((passwordMatch) => {
            if (passwordMatch) {
              setIsPasswordConfirmed(true);
              setEditMode(true);
              setNewPassword(enteredPassword)
              setVerifyPassword(enteredPassword)
            } else {
              alert("Current password is incorrect.");
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      setEditMode(!editMode);
      setIsPasswordConfirmed(false);
    }
  };





  const openFullSizeModal = (imageUrl) => {
    setClickedImage(imageUrl);
    setShowFullSizeModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const checkCurrentPassword = async (password) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${server_url}/verifyPassword`,
        {
          "password": password,
          "token": token
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm('Are you sure you want to save the changes?');
    if (confirmation) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    // Check that newPassword and verifyPassword are set correctly
    if (!newPassword || !verifyPassword) {
      console.log("New password or verification password is missing.");
      return;
    }

    try {
      if (!editMode) {
        console.log("You need to enter your current password to edit.");
        return;
      }

      // Create an object with the data to send to the server
      const requestData = {
        name: formData.name,
        email: formData.email,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        isNumberShow:formData.isNumberShow,
        isEmailShow:formData.isEmailShow,
        isBirthDateShow:formData.isBirthDateShow,
        newPassword: newPassword,
        verifyPassword: verifyPassword,
        token: token,
      };

      // Use axios to send the requestData object with the Authorization header
      const response = await axios.put(`${server_url}/updateMyProfile`, requestData, config);

      if (response.status === 200) {
        console.log("User data updated successfully.");
        setUser(response.data.data);
        setEditMode(false);
        window.location.reload(false);
      } else {
        console.log("Server returned an error:", response.data.message);
        // Handle error response from the server, such as displaying an error message to the user
      }
    } catch (error) {
      console.error(error);
      // Handle other client-side errors, if any
    }}
    else {
      // Handle cancel action (optional)
      console.log('Save changes cancelled.');
    }
  };


  const handleCancel = () => {
    const confirmation = window.confirm('Are you sure you want to cancel the changes?');
  
    if (confirmation) {
      // Reset form data or navigate away, etc. (whatever cancel action you want)
      setEditMode(false);
      setFormData(user);
      console.log('Changes cancelled.');
    } else {
      // Handle cancel action (optional)
      console.log('Cancel action cancelled.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/userlogin');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedValue = type === 'checkbox' ? checked : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: updatedValue,
    }));
  };




  const handleEditImage = () => {
    setShowOptions(!showOptions);
  };


  const handleUploadImage = () => {
    // Trigger the file input dialog
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveNewImage = async () => {
    const confirmation = window.confirm('Are you sure you want to save the new image?');
    if (confirmation) {

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Make sure newImage contains the image file
      const fileInput = fileInputRef.current;
      if (!fileInput || !fileInput.files[0]) {
        console.error("No file selected");
        return;
      }

      formData.append('image', fileInput.files[0]);
      formData.append('token', token);

      const response = await axios.put(
        `${server_url}/userProfile/image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setUser(response.data.data);
      setShowOptions(false);
      setNewImage(null); // Clear the newImage state
    } catch (error) {
      console.error(error);
    }
  } else {
    // Handle cancel action (optional)
    console.log('Image upload cancelled.');
  }
  };

  const showFullSizeImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
  };


  const handleDeleteImage = async () => {
    const confirmation = window.confirm('Are you sure you want to delete the image?');
    if (confirmation) {
    try {

      const token = localStorage.getItem('token');
  
      const response = await axios.delete(
        `${server_url}/userProfile/deleteUserImage`,
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
  } else {
    // Handle cancel action (optional)
    console.log('Image deletion cancelled.');
  }
  };
  


  return (
    <Container>
      {user ? (
        <Card className="p-3 mb-3" style={{ marginTop: "20px" }}>
          <h1 className="text-center mt-4 mb-4" style={{color:'#0d6efd'}}>פרופיל אישי - {user.name}</h1>
          {editMode && isPasswordConfirmed ? (
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
              <Form.Group controlId="isEmailShow">
  <Form.Check
    type="checkbox"
    label="הצג כתובת אימייל"
    name="isEmailShow"
    checked={formData.isEmailShow}
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
              <Form.Group controlId="isBirthDateShow">
  <Form.Check
    type="checkbox"
    label="הצג תאריך לידה"
    name="isBirthDateShow"
    checked={formData.isBirthDateShow}
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
              <Form.Group controlId="isNumberShow">
  <Form.Check
    type="checkbox"
    label="הצג מספר פלאפון"
    name="isNumberShow"
    checked={formData.isNumberShow}
    onChange={handleChange}
  />
</Form.Group>


              <Form.Group controlId="password">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password" // Change the type to password for secure input
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} // Update the state when the input changes
                />
              </Form.Group>
              <Form.Group controlId="verifyPassword">
                <Form.Label>Verify Password</Form.Label>
                <Form.Control
                  type="password" // Change the type to password for secure input
                  name="verifyPassword"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)} // Update the state when the input changes
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


              <div className="profile-image-container text-center">
                <div className="image-frame" onClick={() => openFullSizeModal(`${server_url}/${user.image}`)}>
                  <div className="rounded-circle d-inline-block position-relative">
                    {newImage ? (
                      <Image src={newImage} alt="User Image" className="profile-image-inner" />
                    ) : (
                      <Image src={`${server_url}/${user.image}`} alt="User Image" className="profile-image-inner" />
                    )}
                    {/* Add an options menu */}
                    <div
                      className={`options-menu ${showOptions ? 'visible' : ''}`}
                      onClick={(e) => e.stopPropagation()} // Prevent the click from closing the options menu
                    >
                      <ul>
                        <li onClick={() => { handleUploadImage(); setShowOptions(false); }}>Upload Image</li>
                        <li onClick={() => { handleDeleteImage(); setShowOptions(false); }}>Remove Image</li>
                      </ul>
                    </div>
                    {/* Edit button */}
                    <Button
                      variant="link"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event propagation to the container
                        handleEditImage(); // Call your handleEditImage function
                      }}
                      className="edit-button position-absolute button-above-image border border-primary"
                    >
                      <FontAwesomeIcon icon={faEdit} size="lg" />
                    </Button>
                  </div>
                </div>
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
                <input
                  type="file"
                  accept="image/*"
                  id="imageUpload"
                  ref={fileInputRef} // Add this ref attribute
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {newImage && (
                  <div className="mt-2">
                    <Button variant="primary" onClick={handleSaveNewImage}>
                      Save New Image
                    </Button>
                    <Button variant="secondary" onClick={() => setNewImage(null)}>
                      Cancel
                    </Button>
                  </div>
                )}
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
                    <td>{formatDate(user.dateOfBirth)}</td>

                      <td>תאריך לידה</td>
                    </tr>
                    <tr>
        <td>
          {user.phone ? (
            <>
              {user.phone}{' '}
              {user.isNumberShow ? (
                <span style={{ color: 'green' }}>
                  <FontAwesomeIcon icon={faGlobe} /> מספר ציבורי
                </span>
              ) : (
                <span style={{ color: 'red' }}>
                  <FontAwesomeIcon icon={faLock} /> מספר פרטי
                </span>
              )}
            </>
          ) : (
            'N/A'
          )}
        </td>
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