import React, { useState, useEffect, useRef } from 'react';

interface Message {
  messageId: number;
  chatId: string;
  sender: 'USER' | 'AI';
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatComponentProps {
  initialMessages: Message[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMsg: Message = {
        messageId: messages.length + 1,
        chatId: 'some-chat-id', // Replace with your chatId
        sender: 'USER',
        message: newMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');

      // TODO: Make API call to save message
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto my-4 border p-4 rounded shadow-md">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={`flex ${
              msg.sender === 'USER' ? 'justify-end' : 'justify-start'
            } my-2`}
          >
            <div
              className={`p-2 rounded-lg ${
                msg.sender === 'USER' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              } max-w-xs`}
            >
              <p>{msg.message}</p>
              <span className="block text-xs text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Prompt input for new messages */}
      <div className="p-2 mt-4 border-t">
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="mt-2 w-full bg-blue-500 text-white rounded p-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
