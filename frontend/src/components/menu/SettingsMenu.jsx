import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useMusicPlayer } from '../../context/MusicPlayerContext.jsx';

export const SettingsMenu = () => {
  const { t } = useTranslation();
  const githubUrl = 'https://github.com/mincxnta/phansite';
  const { isMuted, toggleMute } = useMusicPlayer();

  return (
    <div
      style={{
        position: 'fixed',
        top: '60px',
        right: '20px',
        backgroundColor: '#1C2526',
        padding: '20px',
        border: '2px solid #AB0000',
        borderRadius: '8px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        minWidth: '200px',
      }}
    >

      <div style={{ position: 'relative' }}>
        <button
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#AB0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <LanguageSwitcher />
        </button>
      </div>
      
      <div style={{ position: 'relative' }}>
        <button
          onClick={toggleMute}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#AB0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {isMuted ? t('settings.music.enable') : t('settings.music.disable')}
        </button>
      </div>

      <a href={`mailto:p5phansite@gmail.com?subject=${t('settings.email.subject')}`}
        style={{
          display: 'block',
          padding: '10px',
          backgroundColor: '#AB0000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {t('settings.email.title')}
      </a>

      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '10px',
          backgroundColor: '#AB0000',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        {t('settings.about')}
      </a>
    </div>
    
  );
};