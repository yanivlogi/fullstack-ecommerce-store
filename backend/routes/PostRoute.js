import express from "express"; 
import upload from '../upload.js'


import {
    getAllPosts, 
    getMyPosts,
    getPostById,
    savePost,
    updatePost,
    deletePost,
    somePosts,
    adoptPost,
    adoptedPosts
     
    
   

 } from "../controllers/PostController.js"

 const router = express.Router();



router.get('/posts', getAllPosts);
router.get('/adoptedPosts', adoptedPosts);
router.get('/getMyPosts', getMyPosts);
router.get('/somePosts', somePosts);
router.get('/posts/:id', getPostById);
router.post(`/posts/:id/adopt`, adoptPost);
router.post('/posts', upload.array('image[]',10),savePost);
router.put('/posts/:id' , upload.array('image[]',10),updatePost);
router.delete('/posts/:id', deletePost);


export default router;

