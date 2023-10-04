import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/users/userLogin", {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const name = response.data.user.name;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        setUsername("");
        setPassword("");
        setErrorMessage("");
        setLoggedIn(true);
        navigate("/");
        window.location.reload(true);
      } else {
        setErrorMessage(response.data);
      }
    } catch (error) {
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  const checkIfLoggedIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/userLogin");
    } else {
      try {
        const response = await axios.post("http://localhost:5000/users/checkIfLoggedIn", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const user = response.data;
          setUsername(user.username);
          setLoggedIn(true);
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/userLogin");
      }
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center">Login Page</Card.Title>
              <Form onSubmit={handleLoginFormSubmit}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-block">
                  Login
                </Button>
              </Form>

              {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}

              {loggedIn && <p className="text-success mt-3 text-center">You are logged in.</p>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
