import React, { useEffect, useState, useRef } from 'react';

const BackgroundMusic = ({ isMuted, volume }) => {
  const audioRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    audio.volume = volume;

    if (!hasStarted && !isMuted) {
      audio
        .play()
        .then(() => {
            setHasStarted(true);
            audio.loop = true;
          })
        .catch((error) => {
          console.error(error);
        });
    }
    
    audio.muted = isMuted;
  }, [isMuted, hasStarted]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;
  }, [volume]);

  return (
    <div>
      <audio ref={audioRef} src="/audio/background-music.mp3" />
    </div>
  );
};

export default BackgroundMusic;