import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Ensure environment variables are loaded
dotenv.config();

// Use the API Key, not GoogleAuth, for the Google Gen AI SDK
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Corrected error message to match the key name
  throw new Error(
    "GEMINI_API_KEY is missing in .env. Get your API Key from Google AI Studio."
  );
}

// Initialize the GoogleGenAI client
const genAI = new GoogleGenAI(apiKey);

// Export the genAI instance directly to use chats.create
export const ai = genAI;
