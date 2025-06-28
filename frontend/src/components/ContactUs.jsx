import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ContactUs.css';
import SentButton from './buttons/butttonSend/buttonSend';
import { Alert } from "react-bootstrap";

const ContactUs = () => {
  const [contactInfo, setContactInfo] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const server_url = process.env.REACT_APP_SERVER_URL;

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${server_url}/contact-info`);
        setContactInfo(res.data);
      } catch (err) {
        console.error("שגיאה בטעינת פרטי יצירת קשר:", err);
      }
    };
    fetchContactInfo();
  }, [server_url]);

  const isEmailValid = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setValidationError('אנא מלא/י את כל השדות');
      return;
    }

    if (!isEmailValid(email)) {
      setValidationError('כתובת המייל אינה תקינה');
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
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setSuccess(false);
        setError(response.data.message);
      }
    } catch (error) {
      console.error('שגיאה בשליחת הודעה:', error);
      setSuccess(false);
      setError('אירעה שגיאה בשליחה');
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-info-box">
        <h2>{contactInfo.title || "ביס מהטבע"}</h2>
        <p>{contactInfo.description || "חקלאות אורגנית ומשלוחי ירקות ופירות"}</p>
        <p>📞 {contactInfo.phone}</p>
        <p>✉️ {contactInfo.email}</p>
        <p>📍 {contactInfo.address}</p>
        <div className="social-icons">
          <a href={contactInfo.facebook}><i className="fab fa-facebook"></i></a>
          <a href={`mailto:${contactInfo.email}`}><i className="fas fa-envelope"></i></a>
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h2>יש לכם שאלה? צרו קשר!</h2>
        {validationError && <Alert variant="danger">{validationError}</Alert>}

        <input
          type="text"
          placeholder="שם*"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="אימייל*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <textarea
          placeholder="הודעה*"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>

        <SentButton type="submit">שלח/י הודעה</SentButton>

        {success && <div className="success-message">✅ ההודעה נשלחה בהצלחה!</div>}
        {error && <div className="error-message">❌ {error}</div>}
      </form>
    </div>
  );
};

export default ContactUs;
