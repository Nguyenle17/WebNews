import mongoose from "mongoose";
const { Schema } = mongoose

const interestSchema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Interest = mongoose.model("Interest", interestSchema);
export default Interest;
