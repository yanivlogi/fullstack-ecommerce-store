import express from "express"; 
import upload from '../upload.js'; // Multer config for handling images

import {
  getAllProducts,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
  getProductImage
} from "../controllers/productController.js";

const router = express.Router();

// שליפת כל המוצרים עם אפשרות לסינון
router.get('/products', getAllProducts);

// שליפת מוצר בודד לפי מזהה
router.get('/product/:id', getProductById);

// הוספת מוצר חדש עם העלאת תמונות
router.post('/product', upload.array('image[]', 10), saveProduct);

// עדכון מוצר קיים עם אפשרות להוספת תמונות ולמחיקת קיימות
router.put('/product/:id', upload.array('image[]', 10), updateProduct);

// מחיקת מוצר
router.delete('/product/:id', deleteProduct);

// הצגת קובץ תמונה לפי שם
router.get('/images/:filename', getProductImage);

export default router;
