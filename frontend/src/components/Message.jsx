import React from "react";

const MAX_CHAT_LENGTH = 60;

export const Message = ({ username, text, mode, profilePicture }) => {
  const displayText =
    mode === "chat" && text.length > MAX_CHAT_LENGTH
      ? text.slice(0, MAX_CHAT_LENGTH) + "..."
      : text;

  const isComment = mode === "comentario";
  const backgroundColor = isComment ? "bg-white" : "bg-black";
  const borderColor = isComment ? "border-black" : "border-white";
  const textColor = isComment ? "text-black" : "text-white";

  return (
    <div className="flex p-4">
      <div className="relative mr-4">
        <div className="w-[100px] h-[100px] bg-white outline-6 outline-black border-6 border-white transform -skew-x-6">
          <img
            src={profilePicture || "/assets/requests/unknownTarget.png"}
            alt="Profile picture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="relative flex-1">
        {isComment && (
          <div className="absolute top-0 right-2 text-black text-sm">
            ⚠️
          </div>
        )}

        <div className={`px-6 py-2 transform -skew-x-12 w-[600px] ${backgroundColor} border-2 ${borderColor}`}>
          <div className="skew-x-12">
            <div className="mb-1 text-left">
              <span className={`font-earwig text-2xl ${textColor}`}>
                {username}
              </span>
            </div>
            <p className={`text-lg font-semibold ${textColor}`}>{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};