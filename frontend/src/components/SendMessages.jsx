import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";



const SendMessages = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const chatContainerRef = useRef(null);
  const { id } = useParams();

  useEffect(() => {
    fetchUser();
    fetchMessages();
    console.log("Calling markMessagesAsRead...");
    markMessagesAsRead(id);
  }, [id]);

  


 

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get("http://localhost:5000/Header", {
          headers: { Authorization: token },
        });
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const markMessagesAsRead = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/${userId}/markAsRead`,
        null,
        {
          headers: { Authorization: token },
        }
      );
  
      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };
  
  
  

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/messages/${id}`, {
        headers: { Authorization: token },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const token = localStorage.getItem("token");
      if (newMessage.trim() !== "") {
        const messageData = {
          content: newMessage,
          timestamp: new Date().toISOString(),
        };

        await axios.post(`http://localhost:5000/message/${id}`, messageData, {
          headers: { Authorization: token },
        });
        setNewMessage("");
        fetchMessages(); // Fetch messages again after sending a new message
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      {user ? (
        <div className="rounded-border-gradient">
          <h2 >{messages.length} : הודעות</h2>

          <div className="chat-container" ref={chatContainerRef}>

            {messages.map((message, index) => (
              <div key={index} className="chat-message" style={{ direction: 'rtl' }}>
                <div className="message-frame">
                  <div className="author-info">
                    <img className="author-image" src={`http://localhost:5000/${message.author.image}`} alt="Profile" />
                    <a href={`/users/${message.author.id}`} className="message-user">{message.author.username}</a>
                  </div>
                  <span className="message-text">{message.message}</span>
                  <span className="message-timestamp">{new Date(message.timestamp).toLocaleString('he-IL')}</span>
                </div>
              </div>
            ))}


          </div>
          <div className="chat-input" >
            <input
            
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="כתוב הודעה..."
            />
            <button onClick={handleSendMessage}>שלח</button>
          </div>
        </div>
      ) : (
        <div>Loading user information...</div>
      )}
    </div>
  );
};

export default SendMessages;
