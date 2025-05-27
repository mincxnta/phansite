import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useMusicPlayer } from '../../context/MusicPlayerContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const SettingsMenu = () => {
  const { user } = useAuth()
  const { t } = useTranslation();
  const githubUrl = 'https://github.com/mincxnta/phansite';
  const { isMuted, toggleMute } = useMusicPlayer();

  return (
    <div className={`bg-black absolute top-11 lg:top-12 right-0 sm:right-5 py-5 min-w-[13em] -skew-x-6 flex flex-col gap-5 text-xl`}
      style={{
        boxShadow: "6px 4px 0 white",
      }}
    >
      <LanguageSwitcher />

      <div className="table-text w-full" onClick={toggleMute}>
        <button className="flex items-center justify-start gap-2 px-8"

        >
          <img className="w-5 h-auto" src="/assets/images/icons/sound.png" />
          {isMuted ? t('settings.music.enable') : t('settings.music.disable')}
        </button>
      </div>
      <div className="table-text w-full">
        <a className="flex items-center justify-start gap-2 px-8"
          href={`mailto:p5phansite@gmail.com?subject=${t('settings.email.subject')}`}
        >
          <img className="w-5 h-auto" src="/assets/images/icons/contact.png" />
          {t('settings.email.title')}
        </a>
      </div>

      <div className="table-text w-full">
        <a
          className="flex items-center justify-start gap-2 px-8"
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="w-5 h-auto" src="/assets/images/icons/github.png" />
          {t('settings.about')}
        </a>
      </div>
    </div>

  );
};