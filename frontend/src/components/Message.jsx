// components/PersonaBubble.jsx
import React from "react";

const MAX_CHAT_LENGTH = 60;

export default function Message({ username, text, mode }) {
  const displayText =
    mode === "chat" && text.length > MAX_CHAT_LENGTH
      ? text.slice(0, MAX_CHAT_LENGTH) + "..."
      : text;

  return (
    <div className="flex bg-[#a00000] p-4">
      {/* Imagen placeholder con doble borde */}
      <div className="relative mr-4">
        <div className="absolute top-1 left-1 w-[64px] h-[64px] bg-black -z-10 rounded-sm"></div>
        <div className="w-[64px] h-[64px] bg-white flex items-center justify-center rounded-sm">
          {/* Aquí irá la imagen real */}
          <span className="text-black font-bold">IMG</span>
        </div>
      </div>

      {/* Burbuja de texto con skew */}
      <div className="relative flex-1">
        {mode === "comentario" && (
          <div className="absolute top-0 right-2 text-white text-sm">
            🏳️
          </div>
        )}

        <div className="bg-black text-white px-6 py-2 transform -skew-x-12 w-[600px]">
          <div className="skew-x-12">
            <div className="flex items-center gap-1 mb-1">
              {username.split("").map((char, idx) => (
                <span
                  key={idx}
                  className="bg-white text-black text-xs font-bold px-[2px] rotate-[-2deg]"
                >
                  {char}
                </span>
              ))}
            </div>
            <p className="text-lg font-semibold">{displayText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
