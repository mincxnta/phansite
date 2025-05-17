import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMusicPlayer } from '../context/MusicPlayerContext.jsx';
import playlist from '../data/playlist.js';
import '../assets/styles/MusicPlayer.css'

export const MusicPlayer = () => {
  const { t } = useTranslation();
  const { isPlayerOpen, setIsPlayerOpen, isMuted, volume, setVolume } = useMusicPlayer();
  const audioRef = useRef(null);
  const volumeOverlayRef = useRef(null);
  const volumeButtonRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVolumeOverlayOpen, setIsVolumeOverlayOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const currentTrack = playlist[currentTrackIndex];

  const toggleOpen = () => {
    setIsPlayerOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMuted) {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
      setIsVolumeOverlayOpen(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      }
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (isPlaying) {
      audio.currentTime = currentTime;
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      setCurrentTime(audio.currentTime);
      audio.pause();
    }
  }, [isMuted, isPlaying, currentTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.volume = volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.src = currentTrack.src;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentTrackIndex, isMuted]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        volumeOverlayRef.current &&
        !volumeOverlayRef.current.contains(event.target) &&
        volumeButtonRef.current &&
        !volumeButtonRef.current.contains(event.target)
      ) {
        setIsVolumeOverlayOpen(false);
      }
    };

    if (isVolumeOverlayOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVolumeOverlayOpen]);

  const handleTrackEnd = () => {
    handleNextTrack();
  };

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePreviousTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1));
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleVolumeOverlay = () => {
    setIsVolumeOverlayOpen((prev) => !prev);
  };

  if (isMuted) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-2 right-0 z-[1001] cursor-pointer"
        onClick={() => toggleOpen()}
      >
        <img
          src="/assets/music/overlay/CD.png"
          alt={t('music.player.open')}
          className="h-16"
        />
      </div>

      {isPlayerOpen && (
        <div className="-skew-x-3 fixed bottom-8 right-10 bg-white p-4 border-8 border-black text-black flex items-center gap-2 min-w-[35em]"
        >
          <img className="skew-x-2 h-[10em] w-[10em] object-cover"
            src={currentTrack.albumCover}
            alt={currentTrack.title}
          />

          <div className="flex flex-col items-center w-full">
            <div className="italic text-center font-bold text-lg" >
              {currentTrack.title}
            </div>

            <div className="flex justify-center gap-5">
              <button onClick={handlePreviousTrack}>
                <img src="/assets/images/icons/rewind.png" />
              </button>
              <button onClick={togglePlayPause}>
                <img src={`/assets/images/icons/${isPlaying ? "pause.png" : "play.png"}`} />
              </button>
              <button
                onClick={handleNextTrack}>
                <img src="/assets/images/icons/next-song.png" />
              </button>
              <button
                ref={volumeButtonRef}
                onClick={toggleVolumeOverlay}>
                <img src="/assets/images/icons/volume.png" />
              </button>
            </div>

            {isVolumeOverlayOpen && (
              <div className="absolute bottom-8 flex w-[12em]" id="range"
                ref={volumeOverlayRef}
              >
                <input
                  className="range-input"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
            )}
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={handleTrackEnd} />
    </>
  );
};