import './App.css'

function App() {
  return (
    <div className="flex h-screen">
      {/* Left panel */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <ul>
          <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">Chat 1</li>
          <li className="p-2 rounded hover:bg-gray-100 cursor-pointer">Chat 2</li>
        </ul>
      </aside>

      {/* Right panel */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-gray-700">Welcome to Gemini Chat Interface!</p>
        </div>
        <div className="border-t p-4 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg">
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;

