import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const AllMessages = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/allMessages", {
        headers: { Authorization: token },
      });
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  return (
    <div className="send-messages">
      <h2 className="mb-4">ההודעות שלי</h2>
      <div>
        <ul className="list-group small-list" style={{ direction: "rtl" }}>
          {chats.map((chat) => (
            <Link
              to={`/sendmessage/${chat.author.id}`}
              className="text-decoration-none"
              key={chat.author.id}
            >
              <li className="list-group-item d-flex justify-content-between align-items-center chat-item">
                <div className="user-info">
                  <img
                    src={`http://localhost:5000/${chat.author.image}`}
                    alt=""
                    className="user-avatar"
                  />
                  <div className="user-details">
                    <p className="mb-0 font-weight-bold">{chat.author.username}</p>
                    <p className="text-muted mb-1 small">{chat.lastMessage}</p>
                    <p className="text-muted mb-0 small">
                      {chat.lastMessageDate.toLocaleString("he-IL")}
                    </p>
                  </div>
                </div>
                <div>
                  <span className="badge bg-secondary small mr-2">{chat.messageCount} messages</span>
                  {chat.unreadCount > 0 ? (
                    <span className="badge bg-primary small">{chat.unreadCount} unread</span>
                  ) : (
                    <span></span>
                  )}
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllMessages;
