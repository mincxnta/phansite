import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import '../../assets/chat/ChatMessages.css';
import { locales } from '../../utils/dateLocales.js'
import { format } from 'date-fns';

export const ChatMessages = ({ messages, currentUserId }) => {
  const { t, i18n } = useTranslation();
  const messageEndRef = useRef(null)

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behvior: "smooth" })
    }
  },
    [messages])

  if (!messages || messages.length === 0) {
    return <div className="messages-container">{t('chat.empty.message')}</div>;
  }

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.senderId === currentUserId ? "sent" : "received"
            }`}
          ref={messageEndRef}
        >
          <img
            src={
              message.sender?.profilePicture
                ? `${API_URL}${message.sender.profilePicture}`
                : '/assets/requests/unknownTarget.png'
            }
            alt={message.sender?.username || 'Sender'}
            className={`message-avatar ${message.senderId === currentUserId ? 'message-avatar-right' : 'message-avatar-left'
              }`}
          />
          <div className={`message-content ${message.senderId === currentUserId ? 'message-content-right' : 'message-content-left'
            }`}>

            {message.image &&
              <img
                src={`${API_URL}${message.image}`}
                alt='Message image'
                className="message-image"
              />
            }
            {message.message && <p className="message-text">{message.message}</p>}
            <p className="message-date">
              {format(new Date(message.date), 'HH:mm', {
                locale: locales[i18n.language],
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};