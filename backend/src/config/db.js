import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongo DB connection successful')
    } catch (error) {
         console.error("❌ MongoDB connection failed:", error.message);
    }
}