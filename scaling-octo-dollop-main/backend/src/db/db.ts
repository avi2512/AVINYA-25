import mongoose, { model, Schema } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL as string;

if (!MONGO_URL) {
  throw new Error("MONGO_URL is not defined in .env file");
}

mongoose.connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
});

export const UserModel = model("User", userSchema);


const lostItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  status: { type: String, enum: ['lost', 'found'], required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  imageUrl: { type: String },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
});


export const LostItemModel = model("LostItem", lostItemSchema);
