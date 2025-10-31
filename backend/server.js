import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import { connectDB } from "./src/config/db.js";
import chatRoutes from './src/routes/chatRoutes.js'
import cors from "cors";


const app = express()
const PORT = process.env.PORT || 3000

//Middleware to parse json body
app.use(express.json())

//Only for development puposes. 
app.use(cors())

// Connect to db
connectDB();

app.use('/api', chatRoutes)

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})  