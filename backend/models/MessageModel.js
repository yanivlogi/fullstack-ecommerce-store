// Comment Schema
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userReceive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isReadByUser: {
      type: Boolean,
      default: false
    },
    isReadByReceive: {
      type: Boolean,
      default: false
    },
 
  });
  export default mongoose.model('Message', messageSchema)