import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isActivated, setIsActivated] = useState(false); // Добавляем состояние для статуса активации
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
        const isActive = response.data.user.isActive; // Получаем статус активации
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        setUsername("");
        setPassword("");
        setErrorMessage("");
        setLoggedIn(true);

        if (!isActive) {
          // Если пользователь не активирован, перенаправляем на страницу активации
          navigate("/activate");
        } else {
          navigate("/");
          window.location.reload(true);
        }
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
          setIsActivated(user.isActive); // Устанавливаем статус активации
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
    <div className="container">
      <h1>Login Page</h1>
      <Form onSubmit={handleLoginFormSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(event) => setUsername(event.target.value)} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {loggedIn && isActivated && <p>You are logged in.</p>} {/* Проверяем, активирован ли пользователь */}
      {loggedIn && !isActivated && <p>Your account is not activated. Please check your email.</p>}
    </div>
  );
};

export default Login;
