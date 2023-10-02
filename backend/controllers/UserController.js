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
    const token = req.headers.authorization.split(' ')[1];
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
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).send('Please provide both username and password');
      return;
    }
    const user = await User.findOne({ username });

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

//_____________________________________________________________
export const verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the user's password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.status(200).json({ message: 'Password verified successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
//_____________________________________________________________
export const updateMyProfile = async (req, res) => {
  try {
    let image;
    if (req.file) {
      image = req.file.path.replace('uploads\\', '/');
    }
    const token = req.headers.authorization;

    // Verify the token and get the user ID
    const decoded = jwt.verify(token, jwt_key);
    const userId = decoded.id;

    const {
      username,
      name,
      email,
      password,
      verifyPassword, // Add verifyPassword field
      newPassword,
      gender,
      dateOfBirth,
      phone,
    } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the provided password and verifyPassword
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isVerifyPasswordValid = password === verifyPassword;
    if (!isPasswordValid || !isVerifyPasswordValid) {
      return res.status(401).json({ message: 'Invalid password or verification password' });
    }

    if (newPassword) {
      const myEncPassword = await bcrypt.hash(newPassword, 10);
      user.password = myEncPassword;
    }

    // Set the update object to the new values
    const updateData = {};
    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (gender) updateData.gender = gender;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (phone) updateData.phone = phone;
    if (image) {
      updateData.image = image;
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    res.status(200).json({ data: updatedUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};




