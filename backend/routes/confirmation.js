// routes/confirmation.js

import express from 'express';
import { sendConfirmationCode } from '../service/emailService.js';
import { confirmRegistration } from '../service/confirmationService.js';

const router = express.Router();
// POST запрос для отправки кода подтверждения
router.post('/send-confirmation-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Отправляем код подтверждения
    const confirmationCode = await sendConfirmationCode(email);

    res.status(200).json({ confirmationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending confirmation code' });
  }
});

router.post('/confirm-registration', async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
      }
  
      // Проверяем код подтверждения
      const isConfirmed = await confirmRegistration(email, code);
  
      if (isConfirmed) {
        // Регистрация успешно подтверждена
        res.status(200).json({ message: 'Registration confirmed successfully' });
      } else {
        // Код подтверждения неверный или истек
        res.status(400).json({ message: 'Invalid or expired confirmation code' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error confirming registration' });
    }
  });

export default router;
