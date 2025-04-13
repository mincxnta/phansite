import '../../assets/chat/ChatList.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import { formatDistanceToNow } from 'date-fns';
import { locales } from '../../utils/dateLocales.js';
import { toast } from 'react-toastify';
import { Loading } from '../Loading.jsx';

export const ChatList = () => {
  const { user, onlineUsers, socket } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/messages/users`, {
          method: 'GET',
          credentials: 'include',
        });

        const data = await response.json()
        if (!response.ok) {
          toast.error(t(errorHandler(data)))
        }

        const sortedUsers = data.sort((a, b) => {
          return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
        });
        setContacts(sortedUsers);

      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchContacts();
  }, [user, navigate, t]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on('newMessage', (newMessage) => {
      if (newMessage.receiverId !== user.id) return;

      setContacts((prevContacts) =>
        prevContacts
          .map((contact) =>
            contact.id === newMessage.senderId
              ? {
                  ...contact,
                  lastMessage: {
                    message: newMessage.message || (newMessage.image ? '[Imatge]' : ''),
                    date: newMessage.date,
                  },
                }
              : contact
          )
          .sort((a, b) => {
            return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
          })
      );
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, user]);

  const handleContactClick = (username) => {
    navigate(`/chat/${username}`);
  };

  if (isLoading) {
    return <Loading/>;
  }

  return (
    <div className="chat-list">
      <h1>{t('chat.header')}</h1>
      {contacts.length === 0 ? (
        <p>{t('chat.empty.chat')}</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleContactClick(contact.username)}
              className="conversation-item"
            >
              <div className="conversation-info">
                <img
                  src={
                    contact.profilePicture
                      ? `${API_URL}${contact.profilePicture}`
                      : '/assets/requests/unknownTarget.png'
                  }
                  alt={contact.username}
                  className="conversation-avatar"
                />
                {onlineUsers.includes(contact.id) && (
                  <span className="online-indicator"></span>
                )}
                <div className="conversation-details">
                  <p className="conversation-username">{contact.username}</p>
                  {contact.lastMessage ? (
                    <div className="last-message-container">
                      <p className="last-message">
                        {contact.lastMessage?.message?.length > 30
                          ? `${contact.lastMessage.message.slice(0, 30)}...`
                          : contact.lastMessage.message}
                      </p>
                      <p className="last-message-date">
                        {contact.lastMessage?.date
                          ? formatDistanceToNow(new Date(contact.lastMessage.date), {
                            addSuffix: true,
                            locale: locales[i18n.language],
                          })
                          : ''}
                      </p>
                    </div>
                  ) : (
                    <p className="last-message">{t('chat.empty.message')}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};