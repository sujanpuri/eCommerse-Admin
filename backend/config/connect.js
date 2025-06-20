import mongoose from "mongoose";
import dotenv from "dotenv";

const connectDB = async () => {
  try {
    dotenv.config();
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully:");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;