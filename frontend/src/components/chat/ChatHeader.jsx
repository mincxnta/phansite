import React from 'react';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import '../../assets/chat/ChatHeader.css';

export const ChatHeader = ({ targetUser }) => {
  const { t } = useTranslation();

  if (!targetUser) {
    return <div className="header">{t('chat.noUser')}</div>;
  }

  return (
    <div className="header">
      <img
        src={
          targetUser.profilePicture
            ? `${API_URL}${targetUser.profilePicture}`
            : '/assets/requests/unknownTarget.png'
        }
        alt={targetUser.username}
        className="avatar"
      />
      <h2>{targetUser.username}</h2>
    </div>
  );
};