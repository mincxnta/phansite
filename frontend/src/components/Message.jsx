import React from "react";

const MAX_CHAT_LENGTH = 60;

export const Message = ({ username, text, mode, profilePicture }) => {
  const displayText =
    mode === "chat" && text.length > MAX_CHAT_LENGTH
      ? text.slice(0, MAX_CHAT_LENGTH) + "..."
      : text;

  const isComment = mode === "comment";
  const backgroundColor = isComment ? "bg-white" : "bg-black";
  const borderColor = isComment ? "border-black" : "border-white";
  const textColor = isComment ? "text-black" : "text-white";
  const usernameColor = isComment ? "text-white" : "text-black";

  // Falta link al perfil y boton reportar/eliminar
  return (
    <div className="relative w-fit p-4">
      <div className=" absolute  left-0 z-2">
        <div className="w-[80px] h-[80px] bg-white outline-6 outline-black border-6 border-white transform -skew-x-6">
          <img
            src={profilePicture || "/assets/requests/unknownTarget.png"}
            alt="Profile picture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className={`mb-1 absolute left-20 top-1 z-3`}>
        <span className={`font-earwig text-4xl w-fit ${usernameColor} text-border`}>
          {username}
        </span>
      </div>
      <div className="ml-[3.5rem] mt-[.5rem]">
        <div className={`px-6 py-2 transform -skew-x-6 w-[600px] ${backgroundColor} border-2 ${borderColor}`}>
          <div className="skew-x-6 p-[0.5rem]">
            <p className={`text-lg font-semibold ${textColor}`}>{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};