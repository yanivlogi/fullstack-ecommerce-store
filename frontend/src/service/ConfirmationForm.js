import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css';

const ConfirmationForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/confirm-Registration", {
        email,
        code,
      });

      if (response.data.message === "Registration confirmed successfully") {
        setMessage(response.data.message);
        navigate("/");
      } else {
        setMessage("Ошибка подтверждения регистрации.");
      }
      
    } catch (error) {
      setMessage("Ошибка подтверждения регистрации.");
    }
  };

  return (
    <div className="coderegister">
      <h2>Подтверждение регистрации</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="code">Введите код подтверждения:</label>
          <input
            type="text"
            className="form-control"
            id="code"
            value={code}
            onChange={handleCodeChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Подтвердить
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ConfirmationForm;
