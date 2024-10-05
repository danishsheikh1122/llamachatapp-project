import axios from "axios";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  messageId: number;
  chatId?: string;
  sender: "USER" | "AI";
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatComponentProps {
  initialMessages: Message[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();

  // Handle the case where params.id might be an array
  const chatId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to format the messages into conversation history
  const formatConversationHistory = () => {
    return messages.map((msg) => ({
      role: msg.sender.toLowerCase(), // user or ai
      content: msg.message,
    }));
  };

  // Fetch AI response based on user input
  const fetchAIResponse = async (currentMessage: string) => {
    const conversationHistory = formatConversationHistory();

    try {
      // Dummy API Call
      const response = await axios.post(
        "https://llama-32-chatbot-production.up.railway.app/chat",
        {
          current_message: "who am I?",
          conversation_history: [
            {
              role: "user",
              content: "I am Huzail",
            },
          ],
        },
        {
          headers: { "Content-Type": "application/json" }, // Add content type header here
        }
      );
      console.log(response.data);

      // Uncomment the next line if the API response structure is different
      // return response.data.message;

      // Dummy response
      return "This is a dummy AI response."; // Replace this with actual response handling
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  // Save AI response to the chat
  const saveAIResponse = async (aiMessage: Message) => {
    try {
      await axios.post(`/api/chat/${chatId}`, aiMessage, {
        headers: { "Content-Type": "application/json" }, // Add content type header
      });
    } catch (error) {
      console.error("Error saving AI message:", error);
    }
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && chatId) {
      // Add the new user message
      const newMsg: Message = {
        messageId: messages.length + 1,
        chatId: chatId,
        sender: "USER",
        message: newMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");

      try {
        // Save the user message to the server
        await axios.post(`/api/chat/${chatId}`, newMsg, {
          headers: { "Content-Type": "application/json" }, // Add content type header
        });

        // Fetch AI's response
        const aiResponse = await fetchAIResponse(newMessage);

        // Add the AI's response to the chat
        const aiMsg: Message = {
          messageId: messages.length + 2,
          chatId: chatId,
          sender: "AI",
          message: aiResponse,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, aiMsg]);

        // Save the AI's message to the server
        await saveAIResponse(aiMsg);
      } catch (error) {
        console.error("Error handling message:", error);
      }
    } else {
      console.error("Chat ID not available or message is empty.");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto my-4 border p-4 rounded shadow-md">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.messageId}
            className={`flex ${
              msg.sender === "USER" ? "justify-end" : "justify-start"
            } my-2`}
          >
            <div
              className={`p-2 rounded-lg ${
                msg.sender === "USER"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              } max-w-xs`}
            >
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input field for new messages */}
      <div className="p-2 mt-4 border-t">
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
