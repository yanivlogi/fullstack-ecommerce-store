import express from "express";
import upload from '../upload.js'
import { 
    updateUser,
    deleteUser,
    getUserProfile,
    userRegister,
    userLogin,
    authMiddleware,
    userLogout,
    getMyProfile,
    updateMyProfile,
    Header,
    verifyPassword,
    getUnreadMessageCount,
    updateUserImage,
    deleteUserImage
    //
    
} from "../controllers/UserController.js";

 

const router = express.Router();







router.post('/userLogout', userLogout);
router.get('/Header', Header);
router.get('/unreadMessageCount', getUnreadMessageCount);
router.get('/userprofile', getMyProfile );
router.put('/updateMyProfile', updateMyProfile );
router.post('/users/userRegister', upload.single('image'), userRegister);
router.put('/userProfile/image', upload.single('image'), updateUserImage);
router.delete('/userProfile/deleteUserImage', deleteUserImage);

router.post('/verifyPassword', verifyPassword);
router.post('/users/userLogin', userLogin);
router.get('/users/:id', getUserProfile);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


 
export default router;