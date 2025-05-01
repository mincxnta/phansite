import React, { createContext, useContext, useState, useEffect } from 'react';

const MusicPlayerContext = createContext();

export const MusicPlayerProvider = ({ children }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  
  useEffect(() => {
    if (isMuted) {
      setIsPlayerOpen(false);
    }
  }, [isMuted]);

  return (
    <MusicPlayerContext.Provider value={{ isPlayerOpen, setIsPlayerOpen, isMuted, toggleMute, volume, setVolume }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};