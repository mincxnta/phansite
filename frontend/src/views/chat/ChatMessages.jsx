import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/ChatMessages.css';
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

  if (!messages || messages.length === 0 && !messages.image) {
    return <div className="messages-container">{t('chat.empty.message')}</div>;
  }

  return (
    <div className="overflow-y-auto p-5 flex-[8]">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`chat mb-4 ${message.senderId === currentUserId ? 'chat-end sm:mr-[25%]' : 'chat-start sm:ml-[25%]'}`}
        >
          {message.senderId !== currentUserId && (
            <div className="chat-image w-16 h-16 mr-6 bg-white outline-6 outline-black border-6 border-white transform -skew-x-4">
                <img
                  src={
                    message.sender?.profilePicture
                      ? message.sender.profilePicture
                      : '/assets/images/unknownTarget.png'
                  }
                  alt={message.sender?.username || 'Sender'}
                  className="object-cover w-full h-full"
                />
            </div>
          )}
          <div className="chat-bubble md:max-w-[40em] ">
            {message.image && (
              <img
                src={message.image}
                alt="Message image"
                className="max-h-[20em] mt-1.5 mb-2"
              />
            )}
            {message.message && <p className="text-left text-md break-words">{message.message}</p>}
            <p className="text-xs mt-1.5 text-right text-gray-400">
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