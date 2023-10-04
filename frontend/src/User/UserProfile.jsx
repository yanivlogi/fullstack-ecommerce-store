import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams , Link} from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';

const GetUserById = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/users/${id}`, {
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

  if (!user) {
    return <div className="text-center">User does not exist.</div>;
  }

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title className="text-center">User Profile</Card.Title>
          <Card.Img src={`http://localhost:5000${user.image}`}></Card.Img>
          <Card.Text>
            <p><strong>name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
            {/* Render other user information */}
          </Card.Text>
          <Link to={`/sendmessage/${id}`}>send message</Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GetUserById;
