import '../../assets/chat/ChatList.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';


export const ChatList = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/messages/users`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorHandler(errorData));
        }

        const users = await res.json();
        setContacts(users);
      } catch (error) {
        setError(errorHandler(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [user, navigate, t]);

  const handleContactClick = (userId) => {
    navigate(`/chat/${userId}`);
  };

  if (isLoading) {
    return <div>{t('chat.loadingConversations')}</div>;
  }

  return (
    <div className="chat-list">
      {error && <p>{t(error)}</p>}
      <h1>{t('chat.conversations')}</h1>
      {contacts.length === 0 ? (
        <p>{t('chat.noConversations')}</p>
      ) : (
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleContactClick(contact.id)}
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
                <div className="conversation-details">
                  <p className="conversation-username">{contact.username}</p>
                  {contact.lastMessage ? (
                    <div className="last-message-container">
                      <p className="last-message">
                        {contact.lastMessage?.message?.length > 30
                          ? `${contact.lastMessage.message.slice(0, 30)}...`
                          : contact.lastMessage.message}
                      </p>
                      {/* <p className="last-message-date">
                        {contact.lastMessage.date}
                      </p> */}
                    </div>
                  ) : (
                    <p className="last-message">{t('chat.noMessages')}</p>
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