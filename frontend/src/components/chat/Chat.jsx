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
import { toast } from 'react-toastify';

export const Chat = () => {
  const { user, socket } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const { username } = useParams()
  const [isLoading, setIsLoading] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (!username) {
        navigate('/chat');
        return;
      }

      try {
        const userRes = await fetch(`${API_URL}/users/${username}`, {
          credentials: 'include',
        });
        if (!userRes.ok) {
          const errorData = await userRes.json();
          throw new Error(errorHandler(errorData));
        }
        const userData = await userRes.json();
        setTargetUser(userData);

        const res = await fetch(`${API_URL}/messages/${userData.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          toast.error(t(errorHandler(errorData)))
        }

        const messages = await res.json();
        setMessages(messages);
      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user, navigate, t, username]);

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
      const res = await fetch(`${API_URL}/messages/${targetUser.id}`, {
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
      toast.error(t(errorHandler(error)))
    }
  };

  useEffect(() => {
    if (!user || !targetUser  || !socket) {
      if (!user) navigate('/login');
      return;
    }

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId === targetUser.id || newMessage.receiverId === targetUser.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };
    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, navigate, user, targetUser])

  return (
    <div className="chat-container">
      <ChatHeader targetUser={targetUser} />
      <ChatMessages messages={messages} currentUserId={user?.id} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}