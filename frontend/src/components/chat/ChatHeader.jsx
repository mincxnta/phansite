import React from 'react';
//import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import '../../assets/chat/ChatHeader.css';
import { useAuth } from '../../context/AuthContext.jsx'
import { Loading } from '../Loading.jsx';

export const ChatHeader = ({ targetUser }) => {
  //const { t } = useTranslation();
  const { onlineUsers } = useAuth()

  if (!targetUser) {
    return <Loading/>;
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
      {onlineUsers.includes(targetUser.id) && (
        <span className="online"></span>
      )}
    </div>
  );
};