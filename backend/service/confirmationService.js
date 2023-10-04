import User from '../models/UserModel.js';
import ConfirmationCode from '../models/ConfirmationCodeModel.js';
const confirmationCodes = {};
import bcrypt from 'bcrypt';

/**
 * @param {string} email - Адрес электронной почты пользователя.
 * @param {string} code - Код подтверждения.
 * @returns {boolean} - Возвращает true, если регистрация успешно подтверждена, и false в противном случае.
 */
export const confirmRegistration = async (email, code) => {
  try {
    const storedCodeData = await ConfirmationCode.findOne({ email });

    if (!storedCodeData) {
      console.log('Code not found for email:', email);
      return false;
    }

    const currentTime = new Date().getTime();
    console.log('Current time:', new Date(currentTime));
    console.log('Code expiration time:', new Date(storedCodeData.expirationTime));

    if (storedCodeData.expirationTime < currentTime) {
      console.log('Code has expired for email:', email);
      return false;
    }

    const isCodeValid = await bcrypt.compare(code, storedCodeData.code);
    console.log('User input code:', code);
    console.log('Stored code in database:', storedCodeData.code);
    
    if (isCodeValid) {
      console.log('Code is valid for email:', email);
      delete confirmationCodes[email];

      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found for email:', email);
        return false;
      }

      if (user.confirmationCode === code && user.confirmationCodeExpiration > currentTime) {
        console.log('User registration confirmed for email:', email);
        user.isActive = true;
        await user.save();
        return true;
      } else {
        console.log('Invalid or expired confirmation code for email:', email);
        return false;
      }
    }
  } catch (error) {
    console.error('Error in confirmRegistration:', error);
    return false;
  }
};