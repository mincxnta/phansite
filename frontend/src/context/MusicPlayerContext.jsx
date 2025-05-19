import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto para gestionar el estado del reproductor de música.
 * 
 * Proporciona información sobre si el reproductor está abierto,
 * el estado de silencio, el volumen, y funciones para controlar estos estados.
 * 
 */
const MusicPlayerContext = createContext();

/**
 * Proveedor del contexto del reproductor de música.
 * 
 */
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

/**
 * Hook para consumir el contexto del reproductor de música.
 */
export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};