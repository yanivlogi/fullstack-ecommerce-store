
import express from 'express';
import { sendConfirmationCode, resendConfirmationCode } from '../service/emailService.js';
import { confirmRegistration } from '../service/confirmationService.js';
import User from '../models/UserModel.js';

const router = express.Router();

const validateEmail = (email) => {
  return email ? true : false;
};

const validateEmailAndCode = (email, code) => {
  return email && code ? true : false;
};

const emailExistsMiddleware = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email provided' });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).json({ message: 'Email not found in the database' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error checking email existence' });
  }
};

router.post('/send-confirmation-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email provided' });
    }

    const confirmationCode = await sendConfirmationCode(email);

    res.status(200).json({ confirmationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send confirmation code' });
  }
});

router.post('/confirm-registration', async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!validateEmailAndCode(email, code)) {
      return res.status(400).json({ message: 'Invalid email or code provided' });
    }

    const isConfirmed = await confirmRegistration(email, code);

    if (isConfirmed) {
      res.status(200).json({ message: 'Registration confirmed successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired confirmation code' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to confirm registration' });
  }
});

router.post('/resend-confirmation-code', emailExistsMiddleware, async (req, res) => {
  try {
    const { email } = req.body;
    const confirmationCode = await resendConfirmationCode(email);

    res.status(200).json({ confirmationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error resending confirmation code' });
  }
});

export default router;
