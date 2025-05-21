import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import { ChatHeader } from './ChatHeader.jsx'
import { ChatInput } from './ChatInput.jsx'
import { ChatMessages } from './ChatMessages.jsx'
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx';

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

      setIsLoading(true);
      try {
        const user = await fetch(`${API_URL}/users/${username}`, {
          credentials: 'include',
        });

        const userData = await user.json()
        if (!user.ok) {
          toast.error(errorHandler(userData));
        }
        setTargetUser(userData);

        const message = await fetch(`${API_URL}/messages/${userData.id}`, {
          method: 'GET',
          credentials: 'include',
        });

        const messageData = await message.json()
        if (!message.ok) {
          toast.error(t(errorHandler(messageData)))
        }
        ;
        setMessages(messageData);
      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchMessages();
  }, [user, navigate, username]);

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
      const response = await fetch(`${API_URL}/messages/${targetUser.id}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.status == 500) {
        const text = await response.text();
        if (text.includes("Invalid file type")) {
          toast.error(t('error.invalid.file.type'));
          return;
        }
      }

      const data = await response.json()
      if (!response.ok) {
        toast.error(t(errorHandler(data)));
        return;
      }

      setMessages((prevMessages) => [...prevMessages, data]);
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  useEffect(() => {
    if (!user || !targetUser || !socket) {
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
    <div className="w-full h-screen bg-persona-dark-red">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col h-full">
          <ChatHeader targetUser={targetUser} />
          <ChatMessages messages={messages} currentUserId={user?.id} />
          <ChatInput onSendMessage={handleSendMessage} isTargetBanned={targetUser?.banned ?? false} />
        </div>
      )}
    </div>
  )
}