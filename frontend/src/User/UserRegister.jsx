import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../css/UserRegister.css"


const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [gender, setGender] = useState("male");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [validationMsg, setValidationMsg] = useState("");
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);
  const navigate = useNavigate();

  const registerUser = async (e) => {
    e.preventDefault();
    if (username.length < 5) {
      setValidationMsg("Username must be at least 5 characters.");
      return;
    }
    if (name.length < 2) {
      setValidationMsg("Name must be at least 2 characters.");
      return;
    }
    if (!email.includes("@")) {
      setValidationMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationMsg("Password must be at least 6 characters.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("gender", gender);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("phone", phone);
      formData.append("image", image);
      await axios.post(`${server_url}/users/userRegister`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/confirm-registration"); 
    } catch (error) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.message.includes("username")) {
          setValidationMsg("Username already taken. Please choose a different username.");
        } else if (error.response.data.message.includes("email")) {
          setValidationMsg("Email already in use. Please use a different email.");
        } else {
          setValidationMsg("Registration failed. Please try again.");
        }
      } else {
        setValidationMsg("An error occurred. Please try again later.");
      }
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // update the image state when the input value changes
  };

  return (
    <div className="register-container">
    <div className="form-container">
          <form onSubmit={registerUser}>
             {error && <div className="error-message">{error}</div>}
          {validationMsg && <div className="error-message">{validationMsg}</div>}
            <div className="form-group">
              
              <div className="input-group mb-3" id="image-form">
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input-register"
                    id="image"
                    onChange={handleImageChange}
                  />
                  <label className="custom-file-label" htmlFor="image">
                    Choose file
                  </label>
                </div>
              </div>
              {image && (
                <div className="mt-3">
                  <p>Preview:</p>
                  <img src={URL.createObjectURL(image)} alt="Preview" width="200" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                id="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                placeholder="Date of Birth"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                className="form-control"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
      
            <div className="form-group">
              <button type="submit" className="btn btn-success">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    
  );
};

export default UserRegister;
