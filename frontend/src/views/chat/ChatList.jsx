import '../../assets/components/chat/ChatList.css'
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import { formatDistanceToNow } from 'date-fns';
import { locales } from '../../utils/dateLocales.js';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx'
import { useDisplayUsername } from '../../utils/displayUsername.js'
import { Message } from '../../components/Message.jsx';

export const ChatList = () => {
  const { user, onlineUsers, socket } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const displayUsername = useDisplayUsername();
  
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
  }, [user, navigate]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.on('newMessage', async (newMessage) => {
      if (newMessage.receiverId !== user.id) return;

      setContacts((prevContacts) => {
        const existingContact = prevContacts.find(
          (contact) => contact.id === newMessage.senderId
        );

        if (existingContact) {
          return prevContacts
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
        } else {
          const newContact = {
            id: newMessage.senderId,
            username: newMessage.sender.username,
            profilePicture: newMessage.sender.profilePicture,
            lastMessage: {
              message: newMessage.message || (newMessage.image ? `'[${t('image')}]'` : ''),
              date: newMessage.date,
            },
          };
          const updatedContacts = [...prevContacts, newContact];
          return updatedContacts.sort((a, b) => {
            return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
          });

        }
      });
    });

    return () => {
      socket.off('newMessage');
    };
  }, [socket, user]);

  const handleContactClick = (username) => {
    navigate(`/chat/${username}`);
  };

  if (isLoading) {
    return <Loading />;
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
            ? contact.profilePicture
            : '/assets/requests/unknownTarget.png'
        }
        alt={displayUsername(contact)}
        className="conversation-avatar"
      />
      {onlineUsers.includes(contact.id) && (
        <span className="online-indicator"></span>
      )}
      <div className="conversation-details">
        {/* <p className="conversation-username">{displayUsername(contact)}</p> */}
        {contact.lastMessage ? (
          <div className="last-message-container">
            <Message
              username={displayUsername(contact)}
              text={
                contact.lastMessage.message.length > 30
                  ? `${contact.lastMessage.message.slice(0, 30)}...`
                  : contact.lastMessage.message
              }
              mode="chat"
              profilePicture={
                contact.profilePicture || '/assets/requests/unknownTarget.png'
              }
            />
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