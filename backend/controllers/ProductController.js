import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const jwt_key = process.env.JWT_KEY;

// פונקציה להמרה בטוחה למספר
const safeNumber = (val) => {
  const n = Number(val);
  return isNaN(n) ? undefined : n;
};

// הצגת כל המוצרים עם סינון
export const getAllProducts = async (req, res) => {
  try {
    const { search, category, type, minPrice, maxPrice } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (minPrice || maxPrice) {
      const min = Number(minPrice) || 0;
      const max = Number(maxPrice) || Infinity;

      query.$expr = {
        $and: [
          {
            $gte: [
              {
                $cond: {
                  if: { $gt: ["$priceSale", 0] },
                  then: "$priceSale",
                  else: "$price"
                }
              },
              min
            ]
          },
          {
            $lte: [
              {
                $cond: {
                  if: { $gt: ["$priceSale", 0] },
                  then: "$priceSale",
                  else: "$price"
                }
              },
              max
            ]
          }
        ]
      };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// הצגת מוצר יחיד
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// הוספת מוצר חדש
export const saveProduct = async (req, res) => {
  try {
    const token = req.body.userId;
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;

    const imagePaths = Array.isArray(req.files)
      ? req.files.map(file => file.path.replace('uploads/', '')).join(',')
      : '';

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      type: req.body.type,
      barcode: req.body.barcode,
      sku: req.body.sku,
      storeLocation: req.body.storeLocation,
      stock: safeNumber(req.body.stock),
      price: safeNumber(req.body.price),
      priceSale: safeNumber(req.body.priceSale),
      priceCost: safeNumber(req.body.priceCost),
      weight: safeNumber(req.body.weight),
      length: safeNumber(req.body.length),
      width: safeNumber(req.body.width),
      height: safeNumber(req.body.height),
      sellingType: req.body.sellingType,
      images: imagePaths,
      author: userId,
    });

    const saved = await product.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// עדכון מוצר
export const updateProduct = async (req, res) => {
  try {
    const token = req.body.userId;
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;
    const user = await User.findById(userId);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.author.toString() !== userId && !user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // פיצול תמונות קיימות אם הן מחרוזת
    let remainingImages = product.images
      ? product.images.split(',').filter(Boolean)
      : [];

    // מחיקת תמונות לפי אינדקסים
    const removedIndices = JSON.parse(req.body.removedImageIndices || '[]');
    removedIndices.sort((a, b) => b - a).forEach(i => {
      if (i >= 0 && i < remainingImages.length) {
        remainingImages.splice(i, 1);
      }
    });

    const newImages = req.files.map(file => file.path.replace('uploads/', ''));
    const finalImages = [...remainingImages, ...newImages].join(',');

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        type: req.body.type,
        barcode: req.body.barcode,
        sku: req.body.sku,
        storeLocation: req.body.storeLocation,
        stock: safeNumber(req.body.stock),
        price: safeNumber(req.body.price),
        priceSale: safeNumber(req.body.priceSale),
        priceCost: safeNumber(req.body.priceCost),
        weight: safeNumber(req.body.weight),
        length: safeNumber(req.body.length),
        width: safeNumber(req.body.width),
        height: safeNumber(req.body.height),
        sellingType: req.body.sellingType,
        images: finalImages
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// מחיקת מוצר
export const deleteProduct = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, jwt_key);
    const user = await User.findById(decoded.id);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.author.toString() !== decoded.id && !user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(403).json({ message: 'Unauthorized' });
  }
};

// הצגת תמונה לפי שם קובץ
export const getProductImage = (req, res) => {
  const { filename } = req.params;
  const imagePath = path.join('uploads', filename);
  if (fs.existsSync(imagePath)) {
    res.sendFile(path.resolve(imagePath));
  } else {
    res.sendStatus(404);
  }
};
