import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE) 
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));
