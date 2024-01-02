import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './style.css';

const ConfirmationForm = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false); // Состояние, чтобы отслеживать разрешено ли нажимать кнопку
  const [timeLeft, setTimeLeft] = useState(0); // Время задержки
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
    if (!email || isResendDisabled) {
      setMessage("Пожалуйста, введите свой email для отправки кода.");
      return;
    }
  
    setIsResendDisabled(true); // Заблокируем кнопку
  
    try {
      const response = await axios.post(`${server_url}/resend-confirmation-code`, {
        email,
      });
  
      setMessage(response.data.message); // Отображаем сообщение из ответа сервера
  
      if (response.data.confirmationCode) {
        startTimer(); // Запускаем таймер после успешной отправки
      } else {
        setIsResendDisabled(false); // Разблокируем кнопку при ошибке
      }
    } catch (error) {
      setMessage("Ошибка при повторной отправке кода подтверждения. Email который вы вели не существует.");
      setIsResendDisabled(false); // Разблокируем кнопку при ошибке
    }
  };
  

  const startTimer = () => {
    setTimeLeft(60); // Устанавливаем время задержки в секундах (можете изменить по необходимости)

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    // Устанавливаем таймер на разблокировку кнопки после завершения времени задержки
    setTimeout(() => {
      clearInterval(interval);
      setIsResendDisabled(false);
      setTimeLeft(0);
    }, 60000); // 60 секунд
  };

  useEffect(() => {
    return () => {
      // Очищаем таймер, чтобы избежать утечек при размонтировании компонента
      clearInterval();
    };
  }, []);

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
        <button type="handleResendCode" className="btn-secondary" onClick={handleResendCode} disabled={isResendDisabled}>
        לא קיבלתי את הקוד {timeLeft > 0 && `(${timeLeft} sec)`}
        </button>
      </form>
     
      {message && <h1>{message}</h1>}
    </div>
  );
};

export default ConfirmationForm;
