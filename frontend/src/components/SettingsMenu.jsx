import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export const SettingsMenu = ({ isMuted, toggleMute, volume, setVolume }) => {
  const { t } = useTranslation();
//   const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const githubUrl = 'https://github.com/mincxnta/phansite';

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  }

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
        {/* <button
          onClick={() => setIsLanguageOpen(!isLanguageOpen)}
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
          {t('settings.language')}
        </button>
        {isLanguageOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#1C2526',
              border: '1px solid #AB0000',
              borderRadius: '4px',
              padding: '10px',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
            }}
          >
            <LanguageSwitcher onLanguageChange={() => setIsLanguageOpen(false)}/>
          </div>
        )} */}
         <LanguageSwitcher/>
      </div>

        {/* Botón toggle mute/desmute + volumen slider */}
      {/* <button
        onClick={toggleMute}
        style={{
          padding: '10px',
          backgroundColor: isMuted ? '#666' : '#AB0000',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {isMuted ? t('settings.music.enable') : t('settings.music.disable')}
      </button>
      <div>
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
      </div> */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setIsSoundOpen(!isSoundOpen)}
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
          {t('settings.music.title')}
        </button>
        {isSoundOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: '#1C2526',
              border: '1px solid #AB0000',
              borderRadius: '4px',
              padding: '10px',
              zIndex: 1001,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <label style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={!isMuted}
                onChange={toggleMute}
                style={{ width: '16px', height: '16px' }}
              />
              {t('settings.music.enable')}
            </label>
            <div>
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
          </div>
        )}
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