import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useMusicPlayer } from '../../context/MusicPlayerContext.jsx';
import playlist from '../../data/playlist.js';
import '../../assets/MusicPlayer.css';

export const MusicPlayer = () => {
  const { t } = useTranslation();
  const { isPlayerOpen, setIsPlayerOpen, isMuted, volume, setVolume } = useMusicPlayer();
  const audioRef = useRef(null);
  const volumeOverlayRef = useRef(null);
  const volumeButtonRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVolumeOverlayOpen, setIsVolumeOverlayOpen] = useState(false);

  const currentTrack = playlist[currentTrackIndex];

  const toggleOpen = () => {
    setIsPlayerOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMuted) {
      setIsPlaying(false);
      setCurrentTrackIndex(0);
      setIsVolumeOverlayOpen(false);
    }
  }, [isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.volume = volume;
    audio.muted = isMuted;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      audio.pause();
    }
  }, [isMuted, isPlaying, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || isMuted) return;

    audio.src = currentTrack.src;
    if (isPlaying) {
      audio.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  }, [currentTrackIndex, isMuted, isPlaying]);

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
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
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
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1001,
          cursor: 'pointer',
        }}
        onClick={() => toggleOpen()}
      >
        <img
          src="/assets/CD.png"
          alt={t('music.player.open')}
          style={{
            height: '70px'
          }}
        />
      </div>

      {isPlayerOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#1C2526',
            border: '2px solid #AB0000',
            borderRadius: '8px',
            padding: '20px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '15px',
            color: 'white',
          }}
        >
          <img
            src={currentTrack.albumCover}
            alt={currentTrack.title}
            style={{
              height: '150px',
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
              {currentTrack.title}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              <button
                onClick={handlePreviousTrack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                ⏮
              </button>
              <button
                onClick={togglePlayPause}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
              <button
                onClick={handleNextTrack}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                ⏭
              </button>
              <button
                ref={volumeButtonRef}
                onClick={toggleVolumeOverlay}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '24px',
                }}
              >
                📢
              </button>
            </div>

            {isVolumeOverlayOpen && (
              <div
                ref={volumeOverlayRef}
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  right: 0,
                  backgroundColor: '#1C2526',
                  border: '1px solid #AB0000',
                  borderRadius: '4px',
                  padding: '10px',
                  zIndex: 1002,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                  width: '150px',
                }}
              >
                <label style={{ color: 'white', marginBottom: '5px', display: 'block' }}>
                  {t('settings.music.volume')}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  style={{ width: '100%' }}
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