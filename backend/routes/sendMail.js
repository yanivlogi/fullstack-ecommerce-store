
import express from 'express';
const router = express.Router();
import { sendEmail } from '../controllers/SendEmail.js';

router.post('/sendEmail', sendEmail);

export default router;
