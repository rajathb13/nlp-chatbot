# NLP Chatbot - AI Assistant with Gemini

A full-stack chatbot application powered by Google's Gemini AI. Features real-time streaming responses, persistent chat history, and a modern interface.

## Features

- Real-time streaming responses - AI answers appear word-by-word as they're generated
- Persistent chat history - All conversations are saved to MongoDB
- Multiple chat sessions - Create and switch between different conversations
- Smart auto-titling - Chat titles automatically generated from your first message
- 500-word message limit - Prevents overly long inputs
- Delete confirmation - Prevents accidental deletion of important chats
- Clean text responses - Markdown formatting stripped for readability
- Responsive design - Works seamlessly across different screen sizes

## Tech Stack

**Frontend:**

- React 19 with Vite
- Tailwind CSS for styling
- React Query for state management
- Axios and Fetch API for HTTP requests

**Backend:**

- Node.js with Express
- MongoDB with Mongoose
- Google Gemini AI (gemini-2.5-flash model)
- Server-Sent Events for streaming

## Prerequisites

You'll need these installed on your machine:

- Node.js (version 16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API key (get it from Google AI Studio)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/rajathb13/nlp-chatbot.git
cd nlp-chatbot
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with these variables:

```env
MONGODB_URI=mongodb://localhost:27017/chatbot
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

## Running the Application

Open two terminal windows.

**Terminal 1 - Start the backend:**

```bash
cd backend
npm start
```

The backend will run on http://localhost:3000

**Terminal 2 - Start the frontend:**

```bash
cd frontend
npm run dev
```

The frontend will run on http://localhost:5173

Open your browser and navigate to http://localhost:5173 to use the chatbot.

## Project Structure

```
nlp-chatbot/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   └── services/        # Gemini AI setup
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── App.jsx          # Main component
│   └── package.json
│
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api`

**Chat Management:**

- `POST /chats` - Create a new chat session
- `GET /getAllChats` - Retrieve all chat sessions
- `GET /chats/:sessionId` - Get messages for a specific chat
- `DELETE /chats/:sessionId` - Delete a chat session

**Messaging:**

- `POST /chats/:sessionId/message` - Send a message and receive streaming response

### Example Request

```bash
POST /api/chats/:sessionId/message
Content-Type: application/json

{
  "message": "What is the capital of France?"
}
```

The response streams back in real-time as Server-Sent Events.

## Common Issues

**"Chat session not found" error:**
This happens when the server restarts because chat sessions are stored in memory. The backend automatically recreates the session from the database when needed.

**Streaming not working:**
Make sure you're using a modern browser. Streaming requires support for the Fetch API with ReadableStream (Chrome 105+, Firefox 100+, Safari 16+).

**Import case-sensitivity errors:**
If you see errors about file name casing, clear the Vite cache:

```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

## Development

The project includes React Query DevTools for debugging. When running in development mode, you'll see a floating icon in the bottom-right corner. Click it to:

- View all cached queries
- Inspect loading and error states
- Monitor network requests
- See cache invalidation in action

## Environment Variables

**Backend (.env file):**

```env
# Your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/chatbot

# Get this from Google AI Studio
GEMINI_API_KEY=your_api_key_here

# Server port (default: 3000)
PORT=3000
```

The frontend uses `http://localhost:3000/api` as the base URL. You can change this in `frontend/src/hooks/queries/chatQueries.js` if needed.

## Contributing

Contributions are welcome. Here's how:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Test thoroughly
5. Submit a pull request with a clear description

## License

This project is open source and available under the MIT License.

## Author

Rajath B

- GitHub: @rajathb13

## Acknowledgments

This project uses:

- Google Gemini AI for natural language processing
- React Query (TanStack Query) for state management
- Tailwind CSS for styling
- MongoDB for data persistence
