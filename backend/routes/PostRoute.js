import express from "express"; 
//import upload from '../upload.js'
import upload from '../upload.js'


import {
    getPosts, 
    getPostById,
    savePost,
    updatePost,
    deletePost,
    somePosts,
    adoptPost
     
    
   

 } from "../controllers/PostController.js"

 const router = express.Router();



router.get('/posts', getPosts);
router.get('/somePosts', somePosts);
router.get('/posts/:id', getPostById);
router.post(`/posts/:id/adopt`, adoptPost);
router.post('/posts', upload.array('image[]',10),savePost);
router.put('/posts/:id' ,  upload.single('image'),updatePost);
router.delete('/posts/:id', deletePost);


export default router;

