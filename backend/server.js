import express from 'express';
import { connectDB } from "./src/config/db";
import chatRoutes from './src/routes/chatRoutes.js';
import dotenv from 'dotenv'
import cors from "cors";

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

//Middleware to parse json body
app.use(express.json())

//Only for development puposes. 
app.use(cors())

// Connect to db
connectDB();

app.use('/api', chatRoutes)

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})  