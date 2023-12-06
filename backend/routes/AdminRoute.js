import express from "express"; 
import upload from '../upload.js'


import {
    getWaitingPosts, 
    postConfirmation,
    rejectPost
 } from "../controllers/AdminController.js"

 const router = express.Router();



router.get('/getWaitingPosts', getWaitingPosts);
router.post('/:id/postConfirmation', postConfirmation);
router.delete('/:id/rejectPost', rejectPost);


export default router;

