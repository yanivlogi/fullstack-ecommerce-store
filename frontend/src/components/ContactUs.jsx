import React, { useState } from 'react';
import '../css/ContactUs.css';
import axios from 'axios';
import SentButton from './buttons/butttonSend/buttonSend';
import { Alert} from "react-bootstrap";

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [server_url] = useState(process.env.REACT_APP_SERVER_URL);


  const isEmailValid = (email) => {
    // Простая проверка на формат электронной почты с использованием регулярного выражения
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Проверка валидации перед отправкой
    if (!name || !email || !message) {
      setValidationError('please fill all fields');
      return;
    }

    if (!isEmailValid(email)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${server_url}/SendEmail`, {
        name,
        email,
        message,
      });

      if (response.data.success) {
        setSuccess(true);
        setError(null);
        setValidationError(null);
      } else {
        setSuccess(false);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSuccess(false);
      setError('Error sending message');
    }
  };

  return (
    <div className="containercontack">
      <form className="formContact" onSubmit={handleSubmit}>
        <div className="descr">Contact us</div>
        {validationError && <Alert variant="danger">{validationError}</Alert>}

        <div className="inputContact">
          <input
            required=""
            autoComplete="off"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name">Name</label>
        </div>

        <div className="inputContact">
          <input
            required=""
            autoComplete="off"
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="email">E-mail</label>
        </div>

        <div className="inputContact">
          <textarea
            required=""
            cols="30"
            rows="3"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <label htmlFor="message">Message</label>
        </div>
        <SentButton type="submit">Send message →</SentButton>
      </form>
      {success && <div className="success-message" style={{textShadow: '1px 1px 10px #FC0',fontSize:'30px'}}>Your message has been sent Than for your attention</div>}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ContactUs;
