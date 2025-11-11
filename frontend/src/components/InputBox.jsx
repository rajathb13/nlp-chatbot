import React, { useState, useRef, useEffect } from 'react';

const InputBox = ({ onSendMessage, isLoading }) => {
    const [message, setMessage] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const inputRef = useRef(null);
    const MAX_WORDS = 500;

    const countWords = (text) => {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    };

    const handleInputChange = (e) => {
        const text = e.target.value;
        const words = countWords(text);
        
        if (words <= MAX_WORDS) {
            setMessage(text);
            setWordCount(words);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message.trim() && !isLoading && wordCount <= MAX_WORDS) {
            await onSendMessage(message.trim());
            setMessage('');
            setWordCount(0);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }, [message]);

    return (
        <div className="border-t border-gray-300 bg-white p-1 text-center align-center">
            <form onSubmit={handleSubmit} className="mx-auto flex items-center align-center gap-2 w-full max-w-4xl">
                <div className="flex-1 relative pt-1">
                    <textarea
                        ref={inputRef}
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message... (Max 500 words)"
                        className="w-full pr-4 pl-4 py-3 items-center resize-none overflow-hidden rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                        rows="1"
                        disabled={isLoading}
                    />
                </div>
                <div className="flex items-center space-x-4 ml-2">
                    <span className={`text-md ${
                        wordCount > MAX_WORDS ? 'text-red-500' : 'text-gray-500'
                        }`}>
                        {wordCount}/{MAX_WORDS}
                    </span>
                    <button
                        type="submit"
                        disabled={isLoading || wordCount === 0 || wordCount > MAX_WORDS}
                        className={`px-6 py-2 rounded-md ${
                            isLoading || wordCount === 0 || wordCount > MAX_WORDS
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InputBox;