import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/chat/ChatMessages.css';
import { locales } from '../../utils/dateLocales.js';
import { format } from 'date-fns';

export const ChatMessages = ({ messages, currentUserId }) => {
  const { t, i18n } = useTranslation();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!messages || messages.length === 0) {
    return <div className="messages-container">{t('chat.empty.message')}</div>;
  }

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat ${message.senderId === currentUserId ? 'chat-end' : 'chat-start '}`}
        >
          {message.senderId !== currentUserId && (
            <div className="chat-image avatar">
              <div className="rounded-full">
                <img
                  src={
                    message.sender?.profilePicture
                      ? message.sender.profilePicture
                      : '/assets/requests/unknownTarget.png'
                  }
                  alt={message.sender?.username || 'Sender'}
                />
              </div>
            </div>
          )}
          <div className="chat-bubble">
            {message.image && (
              <img
                src={message.image}
                alt="Message image"
                className="message-image"
              />
            )}
            {message.message && <p className="message-text">{message.message}</p>}
            <p className="message-date">
              {format(new Date(message.date), 'HH:mm', {
                locale: locales[i18n.language],
              })}
            </p>
          </div>
        </div>
      ))}
      <div ref={messageEndRef} />
    </div>
  );
};