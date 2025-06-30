import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String },
  address:  { type: String },
  password: { type: String, required: true },
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:   { type: String, default: null }, 
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
export default User;
