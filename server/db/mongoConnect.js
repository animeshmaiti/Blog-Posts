import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blogPosts';
const MONGO_OPTIONS = {
    autoIndex: true
};
const mongoConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI, MONGO_OPTIONS);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed", error);
    }
};

export default mongoConnect;