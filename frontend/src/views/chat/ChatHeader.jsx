import React from 'react';
import { Loading } from '../../components/Loading.jsx';
import { useDisplayUsername } from '../../utils/displayUsername.js'
import { Link } from 'react-router-dom';

export const ChatHeader = ({ targetUser }) => {
  const displayUsername = useDisplayUsername();

  if (!targetUser) {
    return <Loading />;
  }

  return (
    <div className="flex justify-start flex-[1.5] items-end m-5 relative pt-12">
      <div className="flex flex-row items-center sm:px-5 relative">
        <div className="h-12 w-12  bg-black border-2 border-white mr-10 transition-transform hover:scale-110">
          <Link to="/chat">
            <img src="/assets/images/icons/back.png" />
          </Link>
        </div>
        <img
          src={
            targetUser.profilePicture && !targetUser.banned
              ? targetUser.profilePicture
              : '/assets/images/unknownTarget.png'
          }
          alt={displayUsername(targetUser)}
          className="w-18 h-18 mr-4 object-cover bg-white outline-6 outline-black border-6 border-white transform skew-x-2"
        />
        <h2 className="font-earwig text-2xl sm:text-4xl text-black white-border mr-3">{displayUsername(targetUser)}</h2>
        {targetUser.role === "phantom_thief" &&
          <img src="/assets/images/icons/mask.png" alt="" className='h-10' />}
      </div>
    </div>
  );
};