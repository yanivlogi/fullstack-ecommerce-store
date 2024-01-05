import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const jwt_key = process.env.JWT_KEY;


//הצגת כל הפוסטים
export const getWaitingPosts = async (req, res) => {
  try {


    let query = {};

    query.isConfirmed = false;

    let posts = await Post.find(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  

  //asdasda
};



export const postConfirmation = async (req, res) => {
    try {
        const postId = req.params.id; // Assuming the post ID is passed as a route parameter
        const token = req.headers.authorization; // Retrieve the entire Authorization header
        const decoded = jwt.verify(token, jwt_key);

        const user = await User.findById(decoded.id);
        if(!user.isAdmin)
        {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // Update the isAdopted field to true
        post.isConfirmed = true;
        await post.save();
    
        // Return the updated post
        res.json(post);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  };
  

  export const rejectPost = async (req, res) => {
    try {
      const postId = req.params.id;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, jwt_key);
  
      const user = await User.findById(decoded.id);
      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Access Denied' });
      }
  
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Optional: You might want to add a reason for rejection from query parameters
      const rejectionReason = req.query.rejectionReason;
  
      // Delete the post
      await post.remove();
  
      // Return a success message or any other relevant information
      res.json({ message: `Post rejected and deleted successfully. Reason: ${rejectionReason || 'No reason provided'}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
