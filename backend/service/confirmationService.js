import User from '../models/UserModel.js';
import ConfirmationCode from '../models/ConfirmationCodeModel.js';
import bcrypt from 'bcrypt';

export const confirmRegistration = async (email, code) => {
  try {
    const storedCodeData = await ConfirmationCode.findOne({ email });

    if (!storedCodeData) {
      console.log('Code not found for email:', email);
      return false;
    }

    const currentTime = new Date().getTime();

    if (storedCodeData.used) {
      console.log('Code has already been used for email:', email);
      return false;
    }

    if (storedCodeData.expirationTime < currentTime) {
      console.log('Code has expired for email:', email);
      return false;
    }

    const isCodeValid = await bcrypt.compare(code, storedCodeData.code);

    if (isCodeValid) {
      console.log('Code is valid for email:', email);
      storedCodeData.used = true;
      await storedCodeData.save();

      const deletionTime = storedCodeData.usedTime ? storedCodeData.usedTime.getTime() + 2 * 60 * 1000 : 0;

console.log('Current Time:', currentTime);
console.log('Deletion Time:', deletionTime);

if (currentTime > deletionTime) {
  console.log('Deleting code from the database:', storedCodeData._id);
  const deletionResult = await ConfirmationCode.deleteMany({ _id: storedCodeData._id });
  console.log('Deletion Result:', deletionResult);
} else {
  console.log('Code deletion time not reached for email:', email);
}


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
