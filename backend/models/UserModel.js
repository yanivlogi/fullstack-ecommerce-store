import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
  },
  image: {
    type: String,
  },
  phone: {
    type: String,
  },
  isAdmin:{
    type : Boolean,
    default : false,

  },
  isBaned:{
    type : Boolean,
    default : false,
    
  },

  confirmationCode: {
    type: String,
    required: false, 
  },
  confirmationCodeExpiration: {
    type: Date,
    required: false,
  },
 

  isActive: {
    type: Boolean,
    default: false, 
  },
  
  isNumberShow: {
    type: Boolean,
    default: true, 
  },
  isEmailShow: {
    type: Boolean,
    default: true, 
  },
  isBirthDateShow: {
    type: Boolean,
    default: true, 
  },
  

},
{ timestamps: true });

export default mongoose.model('Users', UserSchema);
