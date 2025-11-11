import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./src/config/db.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware to parse json body
app.use(express.json());

//CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Add your Render frontend URL here
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Connect to db
connectDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api", chatRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
