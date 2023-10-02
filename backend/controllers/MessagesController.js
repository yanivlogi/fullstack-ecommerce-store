import Comment from '../models/CommentModel.js'
import Message from '../models/MessageModel.js'
import User from '../models/UserModel.js'
import 'dotenv/config'
import jwt from 'jsonwebtoken';

const jwt_key = process.env.JWT_KEY;

export const addMessage = async (req, res) => {
    try {
      const { content, timestamp } = req.body;
      const userReceive = req.params.id
      const token = req.headers.authorization;
  
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      if (!content) {
        return res.status(400).json({ message: "Empty comment" });
      }
  
      const decoded = jwt.verify(token, jwt_key);
      const author = decoded.id;
  
      const message = new Message({
        message: content,
        user: author,
        userReceive : userReceive,
        timestamp: timestamp,
      });
  
      await message.save();
  
      res.json(message);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  export const markMessagesAsRead = async (req, res) => {
    try {
      
      const { id } = req.params;
      const token = req.headers.authorization;
      const userId = jwt.verify(token, jwt_key).id;

  
      // Find the messages that belong to the other user and are marked as unread
      const messages = await Message.updateMany(
        { userReceive: userId, user: id, isReadByReceive: false },
        { $set: { isReadByReceive: true } }
      );
  
      // Find the messages that belong to the user and are marked as unread
      const userMessages = await Message.updateMany(
        { user: userId, userReceive: id, isReadByUser: false },
        { $set: { isReadByUser: true } }
      );
  
      res.status(200).json({
        success: true,
        message: "Messages marked as read.",
        data: { messages, userMessages },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong." });
    }
  };
  
  
  
  export const getAllMessages = async (req, res) => {
    try {
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, jwt_key);
      const userId = decoded.id;
  
      const receivedMessages = await Message.find({ userReceive: userId }).sort({ timestamp: -1 });
      const sentMessages = await Message.find({ user: userId }).sort({ timestamp: -1 });
  
      const userMessageCounts = {};
      const userUnreadCounts = {}; // New object to store the count of unread messages for each user
      const lastMessages = {}; // New object to store the last message for each chat
  
      receivedMessages.forEach((msg) => {
        const authorId = msg.user.toString();
        userMessageCounts[authorId] = (userMessageCounts[authorId] || 0) + 1;
        if (!msg.isReadByReceive) { // Check if the message is unread by the recipient (current user)
          userUnreadCounts[authorId] = (userUnreadCounts[authorId] || 0) + 1;
        }
        // Store the last message for the chat with the sender's ID as the key
        if (!lastMessages[authorId] || msg.timestamp > lastMessages[authorId].timestamp) {
          lastMessages[authorId] = msg;
        }
      });
  
      sentMessages.forEach((msg) => {
        const authorId = msg.userReceive.toString();
        userMessageCounts[authorId] = (userMessageCounts[authorId] || 0) + 1;
        // Note: We don't check for unread status for sent messages as they are already read by the sender
        // Store the last message for the chat with the recipient's ID as the key
        if (!lastMessages[authorId] || msg.timestamp > lastMessages[authorId].timestamp) {
          lastMessages[authorId] = msg;
        }
      });
  
      const userIds = [...new Set(receivedMessages.map((msg) => msg.user).concat(sentMessages.map((msg) => msg.userReceive)))];
      const users = await User.find({ _id: { $in: userIds } });
  
      const result = users.map((user) => {
        const authorUsername = user.username || "Unknown";
        const authorId = user._id.toString();
        const messageCount = userMessageCounts[authorId] || 0;
        const unreadCount = userUnreadCounts[authorId] || 0; // Get the count of unread messages for the user
  
        let lastMessage = "";
        let lastMessageDate = "";
  
        const lastMsg = lastMessages[authorId];
        if (lastMsg) {
          lastMessage = lastMsg.message;
          lastMessageDate = lastMsg.timestamp;
        }
  
        return {
          author: { id: user._id, username: authorUsername, image: user.image },
          messageCount: messageCount,
          unreadCount: unreadCount,
          lastMessage: lastMessage,
          lastMessageDate: lastMessageDate,
        };
      });
  
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong." });
    }
  };
  
  
  
  
  
  
  

  export const getMessages = async (req, res) => {
    try {
        const token = req.headers.authorization;

        // Verify the token and get the user ID
        const decoded = jwt.verify(token, jwt_key);
        const userId = decoded.id;
        const userReceiveId = req.params.id;
  
      const messages = await Message.find({
        $or: [
          { user: userId, userReceive: userReceiveId },
          { user: userReceiveId, userReceive: userId }
        ]
      });
  
      const populateMessages = await Promise.all(
        messages.map(async (msg) => {
          const user = await User.findById(msg.user);
          const authorUsername = user ? user.username : 'Unknown';
          const authorImage = user ? user.image : "/default.jpg";
          return { ...msg.toObject(), author: { id: msg.user, username: authorUsername, image: authorImage } };
        })
      );
  
      res.json(populateMessages);
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong.' });
    }
  };
  


  export const deleteMessage = async (req, res) => {
    const token = req.headers.authorization;     
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, jwt_key);
      const author = decoded.id;// the login user
  
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      console.log("comment.author : "+ comment.author)
      console.log("authorr : "+ author)
      if (comment.author != author) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      await comment.remove();
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };

  


  export const updateMessage = async (req, res) => {
    const token = req.headers.authorization;
    const newContent = req.body.content;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, jwt_key);
      const author = decoded.id; // the login user
  
      const commentId = req.params.id;
      const comment = await Comment.findById(commentId);
  
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
  
      if (comment.author.toString() != author) {
        return res.status(403).json({ message: 'Unauthorized access' });
      }
  
      comment.content = newContent; // Update the comment content
      await comment.save();
  
      res.json({ message: 'Comment updated successfully', comment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  