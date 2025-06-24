import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
const jwt_key = process.env.JWT_KEY;


//הצגת כל הפוסטים
export const getWaitingPosts = async (req, res) => {
  try {


    let query = {};

    query.isConfirmed = false;

    let posts = await Product.find(query);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  

  //asdasda
};



export const postConfirmation = async (req, res) => {
    try {
        const productId = req.params.id; // Assuming the product ID is passed as a route parameter
        const token = req.headers.authorization; // Retrieve the entire Authorization header
        const decoded = jwt.verify(token, jwt_key);

        const user = await User.findById(decoded.id);
        if(!user.isAdmin)
        {
            return res.status(403).json({ message: 'Access Denied' });
        }

        // Find the product by ID
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }

        product.isConfirmed = true;
        await product.save();

        res.json(product);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
  };
  

  export const rejectPost = async (req, res) => {
    try {
      const productId = req.params.id;
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, jwt_key);
  
      const user = await User.findById(decoded.id);
      if (!user.isAdmin) {
        return res.status(403).json({ message: 'Access Denied' });
      }
  
      // Find the product by ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Optional: You might want to add a reason for rejection from query parameters
      const rejectionReason = req.query.rejectionReason;
  
      // Delete the product
      await product.remove();

      res.json({ message: `Product rejected and deleted successfully. Reason: ${rejectionReason || 'No reason provided'}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
