import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import '../../assets/chat/Chat.css';
import { ChatHeader } from './ChatHeader.jsx'
import { ChatInput } from './ChatInput.jsx'
import { ChatMessages } from './ChatMessages.jsx'

export const Chat = () => {
  const { user, socket } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [targetUser, setTargetUser] = useState(null);
  

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (!id) {
        navigate('/chat');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/messages/${id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorHandler(errorData));
        }

        const messages = await res.json();
        setMessages(messages);

        if (messages.length > 0) {
          const otherUser =
            messages[0].senderId === user.id
              ? messages[0].receiver
              : messages[0].sender;
          setTargetUser(otherUser);
        }
      } catch (error) {
        setError(errorHandler(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user, navigate, t, id]);

  const handleSendMessage = async (message, image) => {
    if (!message.trim() && !image) return;

    try {
      const formData = new FormData();
      if (message) {
        formData.append('message', message);
      }
      if (image) {
        formData.append('image', image);
      }
      const res = await fetch(`${API_URL}/messages/${id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorHandler(errorData));
      }

      const newMessage = await res.json();
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    } catch (error) {
      setError(errorHandler(error));
    }
  };

  useEffect(() => {
    if (!user || !id || !socket) {
      if (!user) navigate('/login');
      if (!id) navigate('/chat');
      return;
    }

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId === id || newMessage.receiverId === id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, id, navigate, user])

  return (
    <div className="chat-container">
      {error && <p>{t(error)}</p>}
      <ChatHeader targetUser={targetUser} />
      <ChatMessages messages={messages} currentUserId={user?.id} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}