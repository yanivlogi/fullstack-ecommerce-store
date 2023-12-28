import mongoose from 'mongoose';

const confirmationCodeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  code: { type: String, required: true },
  expirationTime: { type: Date, required: true },
  used: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

const ConfirmationCode = mongoose.model('ConfirmationCode', confirmationCodeSchema);

export default ConfirmationCode;
