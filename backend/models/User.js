import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  photo: String,
  role: {
    type: String,
    enum: ['admin', 'staff', 'user'],
    default: 'user',
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
