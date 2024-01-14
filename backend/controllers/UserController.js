import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import bcrypt from 'bcryptjs'
const jwt_key = process.env.JWT_KEY;
import { sendConfirmationCode } from '../service/emailService.js'; 

//__________________________________________הצגת משתמש_________________________________



export const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const userIdFromURL = req.params.id;
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;

    if (userId === userIdFromURL) {
      res.json({ redirectTo: '/Profile' });
    } else {
      const user = await User.findById(userIdFromURL);
      res.json(user);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




//__________________________________________התחברות__________________________________________

export const userLogin = async (req, res) => {
  try {
    const { account, password } = req.body; // Изменил "username" на "account"
    
    if (!(account && password)) {
      res.status(400).send('Please provide both username/email and password');
      return;
    }

    // Проверяем, является ли введенный аккаунт email'ом
    const isEmail = account.includes('@');
    
    // Изменяем условие поиска в базе данных в зависимости от того, является ли введенный аккаунт email'ом или именем пользователя
    const user = isEmail
      ? await User.findOne({ email: account })
      : await User.findOne({ username: account });

    if (user && (await bcrypt.compare(password, user.password)) && user.isActive) {
      const token = jwt.sign(
        { id: user._id },
        jwt_key,
        { expiresIn: '7 days' }
      )
      user.token = token
      user.password = undefined
      res.status(200).send({
        success: true,
        token,
        user
      });
    } else {
      res.status(401).send('Invalid credentials or account not activated');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//__________________________________________התנתקות____________________________________________

export const userLogout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//__________________________________________הרשמה____________________________________________


export const userRegister = async (req, res) => {
  try {
    const { username, name, email, password, gender, dateOfBirth, phone } = req.body;

    let image = "/maleDefaultImage.jpg"; // Set a default image path
    if (gender == "male") {
      image = "/maleDefaultImage.jpg";
    } else if (gender == "female") {
      image = "/femaleDefaultImage.jpg";
    }

    if (req.file) {
      image = req.file.path.replace("uploads\\", "/");
    }

    if (!(username && name && email && password && gender)) {
      return res.status(400).send("Details cannot be empty.");
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
      return res.status(401).send("User already exists.");
    }

    const myEncPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: username,
      name: name,
      email: email,
      password: myEncPassword,
      gender: gender,
      dateOfBirth: dateOfBirth,
      phone: phone,
      image: image,
    });

    // Отправка кода подтверждения на email
    const confirmationCode = await sendConfirmationCode(email);

    // Установка кода подтверждения и срока действия в базе данных
    const currentTime = new Date().getTime();
    const expirationTime = new Date(currentTime + 30 * 60 * 1000); // Срок действия кода: 30 минут
    await User.findOneAndUpdate(
      { email: email },
      {
        confirmationCode: confirmationCode, // Сохраняем код подтверждения в базе данных
        confirmationCodeExpiration: expirationTime, // Устанавливаем срок действия кода
      }
    );

    const token = jwt.sign({ id: user._id, email }, jwt_key, {
      expiresIn: "7 days",
    });
    user.token = token;
    user.password = undefined;

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



//_______________________________________עדכון משתמש_________________________________________

export const updateUser = async (req, res) => {
  try {
    const updateduser = await User.updateOne({ _id: req.params.id }, { $set: req.body });
    res.status(200).json(updateduser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}


//_______________________________________מחיקת משתמש_________________________________________

export const deleteUser = async (req, res) => {
  try {
    const deleteduser = await User.deleteOne({ _id: req.params.id });
    res.status(200).json(deleteduser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

//_______________________________________פרופיל________________________________________
export const getMyProfile = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization;
    console.log(token)
    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;



    // Find the user by ID
    const user = await User.findById(userId);

    // Return the user data in the response
    res.status(200).json({ data: user });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

//_______________________________________Header_______________________________________

export const Header = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;



    // Find the user by ID
    const user = await User.findById(userId);

    // Return the user data in the response
    res.status(200).json({ data: user });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};
//_______________________________________הודעות שלא נקראו_______________________________________
export const getUnreadMessageCount = async (req, res) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization;

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;

    // Find the messages that belong to the user and are marked as unread
    const unreadMessages = await Message.find({
      userReceive: userId,
      isReadByReceive: false,
    });

    // Return the count of unread messages in the response
    res.status(200).json({ count: unreadMessages.length });
  } catch (error) {
    // Handle any errors
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
//_______________________________________אימות________________________________________

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, jwt_key);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

//___________________________אימות סיסמה שהתקבלה מהמשתמש__________________________________
export const verifyPassword = async (req, res) => {
  try {
    const enteredPassword = req.body.password;
    const token = req.body.token;
 console.log("token : ", token)

    
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;
    console.log("userId : ",userId)
    
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' ,data:user.password});
    }

    res.status(200).json({ message: 'Password verified successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


//________________________________עידכון פרטי משתמש (לא כולל תמונה)_____________________________
export const updateMyProfile = async (req, res) => {
  try {
    const verifyPassword = req.body.verifyPassword;
    const newPassword = req.body.newPassword;
    const token = req.body.token;
    console.log("Received token:", token);
    console.log("Received newPassword:", newPassword); // Add this line
    console.log("Received verifyPassword:", verifyPassword); // Add this line

    if (!token) {
      return res.status(401).json({ message: 'JWT token is missing' });
    }

    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;
    console.log("Token verification successful. User ID:", userId); // Add this line

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify that the verification password matches the new password
    const isVerifyPasswordValid = newPassword === verifyPassword;

    if (!isVerifyPasswordValid) {
      return res.status(401).json({ message: 'Invalid password or verification password' });
    }

    // Hash the new password before updating
    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash the new password

    // Update user data here
    const updateData = {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      isNumberShow: req.body.isNumberShow,
      isEmailShow: req.body.isEmailShow,
      isBirthDateShow: req.body.isBirthDateShow,
      dateOfBirth:req.body.dateOfBirth,
      password: hashedPassword, // Use the hashed password
    };

    // Update the user's password and other fields
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData });

    console.log("User data updated successfully. Sending response...");

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.error(error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid JWT token' });
    }

    res.status(500).json({ message: 'Server Error' });
  }
};




//_______________________________________עדכון תמונת משתמש בלבד_______________________________________
export const updateUserImage = async (req, res) => {
  try {

    let image = req.file;
    const token = req.body.token;


    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key); // Use your jwt_key here
    const userId = decoded.id;

    // Verify the provided token and get the user ID
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile image
    user.image = image.path.replace("uploads\\", "/"); // Correctly update the image path
    const updatedUser = await user.save();

    res.status(200).json({ data: updatedUser, image: user.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};



export const deleteUserImage = async (req, res) => {
  try {
 
    const token = req.headers.authorization;
    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key); // Use your jwt_key here

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile image based on gender
    if (user.gender === 'male') {
      user.image = '/maleDefaultImage.jpg';
    } else if (user.gender === 'female') {
      user.image = '/femaleDefaultImage.jpg';
    }

    // Save the updated user with the new image URL
    const updatedUser = await user.save();

    // Return a success response
    res.status(200).json({ data: updatedUser, image: user.image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
