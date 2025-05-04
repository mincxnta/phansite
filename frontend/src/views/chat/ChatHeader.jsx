import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx'
import { Loading } from '../../components/Loading.jsx';
import { useDisplayUsername } from '../../utils/displayUsername.js'

export const ChatHeader = ({ targetUser }) => {
  const { onlineUsers } = useAuth()
const displayUsername = useDisplayUsername();

  if (!targetUser) {
    return <Loading/>;
  }

  return (
    <div className="flex justify-start flex-[1.5] items-end m-5 relative">
      <div className="flex flex-row items-center px-5 relative">
      <img
        src={
          targetUser.profilePicture
            ? targetUser.profilePicture
            : '/assets/requests/unknownTarget.png'
        }
        alt={displayUsername(targetUser)}
        className="w-12 h-12 mr-4 object-cover"
      />
      <h2>{displayUsername(targetUser)}</h2>
      {onlineUsers.includes(targetUser.id) && (
        <span className="absolute bottom-0 left-15 w-3 h-3 bg-green-500 rounded-full"></span>
      )}
      </div>
    </div>
  );
};