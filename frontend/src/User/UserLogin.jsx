import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Form, Container, Row, Col } from "react-bootstrap";
import "../css/UserLogin.css"
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const navigate = useNavigate();

  const handleLoginFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${server_url}/users/userLogin`, {
        username,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const name = response.data.user.name;
        const isActive = response.data.user.isActive;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        setUsername("");
        setPassword("");
        setErrorMessage("");
        setLoggedIn(true);

        if (!isActive) {
        
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
        const response = await axios.post(`${server_url}/users/checkIfLoggedIn`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          const user = response.data;
          setUsername(user.username);
          setIsActivated(user.isActive); 
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
    <div className="login-container">
      <div className="form-container">
        <h1 className="text-center mb-4">התחברות</h1>
        <form onSubmit={handleLoginFormSubmit}>
          <div className="form-group">
            <label>שם משתמש</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>סיסמה</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {errorMessage && <p className="error-message mt-3">{errorMessage}</p>}

        {loggedIn && isActivated && <p className="success-message mt-3">You are logged in.</p>}
        {loggedIn && !isActivated && (
          <p className="error-message mt-3">Your account is not activated. Please check your email.</p>
        )}
      </div>
    </div>
  );
};

export default Login;
