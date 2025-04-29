import React from 'react';
import '../../assets/chat/ChatHeader.css';
import { useAuth } from '../../context/AuthContext.jsx'
import { Loading } from '../Loading.jsx';
import { useDisplayUsername } from '../../utils/displayUsername.js'

export const ChatHeader = ({ targetUser }) => {
  const { onlineUsers } = useAuth()
const displayUsername = useDisplayUsername();

  if (!targetUser) {
    return <Loading/>;
  }

  return (
    <div className="header">
      <img
        src={
          targetUser.profilePicture
            ? targetUser.profilePicture
            : '/assets/requests/unknownTarget.png'
        }
        alt={displayUsername(targetUser)}
        className="avatar"
      />
      <h2>{displayUsername(targetUser)}</h2>
      {onlineUsers.includes(targetUser.id) && (
        <span className="online"></span>
      )}
    </div>
  );
};