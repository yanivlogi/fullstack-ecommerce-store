
import express from 'express';
const router = express.Router();
import { sendEmail } from '../controllers/SendEmailController.js';

router.post('/sendEmail', sendEmail);

export default router;
