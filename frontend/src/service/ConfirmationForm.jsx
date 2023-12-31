import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css';

const ConfirmationForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);

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
      const response = await axios.post(`${server_url}/confirm-Registration`, {
        email,
        code,
      });

      if (response.data.message === "Registration confirmed successfully") {
        setMessage(response.data.message);
        navigate("/userLogin");
      } else {
        setMessage("Registration confirmation error.");
      }
    } catch (error) {
      setMessage("Registration confirmation error.");
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setMessage("Пожалуйста, введите свой email для отправки кода.");
      return;
    }
    console.log("Email for Resend:", email);  // Добавьте эту строку
    try {
      const response = await axios.post(`${server_url}/resend-confirmation-code`, {
        email,
      });

      if (response.data.confirmationCode) {
        setMessage("Код подтверждения успешно отправлен!");
      } else {
        setMessage("Ошибка при повторной отправке кода подтверждения. Возможно, такой email не зарегистрирован.");
      }
    } catch (error) {
      setMessage("Ошибка при повторной отправке кода подтверждения. Проверьте свое соединение с интернетом и попробуйте снова.");
    }
  };

  return (
    <div className="coderegister">
      <h2>אימות הרשמה</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label style={{color:"red",fontWeight:"bold"}} htmlFor="email">Email:</label>
          <input 
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label style={{color:"red",fontWeight:"bold"}} htmlFor="code">Code:</label>
          <input
            type="text"
            className="form-control"
            id="code"
            value={code}
            onChange={handleCodeChange}
          />
        </div>
        <button type="submit" className="btn-secondary">
        שלח קוד
        </button>
        <button className="btn-secondary"  onClick={handleResendCode}>
        לא קיבלתי את הקוד
         </button>
      </form>
     
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default ConfirmationForm;
