// Performs the following
/**
 * Receiving user messages
 * Assigning incremental session IDs for new chats
 * Saving messages (user + AI) in MongoDB
 * Calling Gemini for AI responses
 * Returning the full chat history to the frontend
*/

import { Chat } from "../models/chatModel";
import ai from "../services/geminiService";
import { getNextSessionId } from "../models/counter";

const activeChats = {}

//Create a new chat session
export const createNewChat = async(req, res) => {
    try {

        //Create a new chat document in MongoDB
        const chat = new Chat({
            sessionId,
            messages: []
        })

        await chat.save();

        //Use mongodb _id as the session id
        const sessionId = chat._id.toString();

        //Create gemini chat session
        const geminiChat = ai.chats.create({model: "gemini-2.5.flash"});
        activeChats[sessionId] = geminiChat

        //successful chat creation
        res.status(201).json({sessionId})
    } catch (error) {
        res.status(500).json({ error: "Failed to create chat session", message: error.message });
    }
}

//Send message to current chat
export const sendMessageToChat = async(req, res) => {
    try {
        const {sessionId} = req.params
        const userMessage = req.body.message

        //Retrieve chat session from MongoDB
        const chat = Chat.findById({sessionId})
        if(!chat) return res.status(404).json({ error: "Chat session not found in database" });

        //Save user message in MongoDB
        chat.messages.push({role: "User", content: userMessage})

        //Map message to gemini roles
        const geminiHistory = chat.messages.map((msg) => ({
            role: msg.role === "User" ? "user" : "model",
            parts: [{text: msg.content}]
        }))

        //Get gemini chat instance
        let geminiChat = activeChats[sessionId]
        if(!geminiChat){
            geminiChat = ai.chats.create({ model: "gemini-2.5-flash", history: geminiHistory });
            activeChats[sessionId] = geminiChat
        }

        //Send message to gemini
        const response = await geminiChat.sendMessage({message: userMessage})

        //Save gemini response in Mongo
        chat.messages.push({role: "AI", content: response.text})
        await chat.save();

        //Return response to frontend
        res.status(200).json({response: response.text, messages: chat.messages})
        
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: "Failed to send message", message: error.message });
    }
}