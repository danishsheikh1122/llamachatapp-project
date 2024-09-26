'use client'
import React, { useEffect, useState } from 'react';
import ChatComponent from './components/ChatComponent';

const ChatPage: React.FC = () => {
  const [initialMessages, setInitialMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/chat/58c46358-f683-498b-b0c1-d73faaf70275');
        const data = await response.json();
        if (data.status === 200) {
          setInitialMessages(data.createMessage);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ChatComponent initialMessages={initialMessages} />;
};

export default ChatPage;
