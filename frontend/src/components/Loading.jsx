import React from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/Loading.css';

export const Loading = () => {
  const { t } = useTranslation();

  return (
    <div className="loading-container">
      {/* Placeholder para el GIF o animación */}
      <div className="loading-spinner"></div>
      <p>{t('loading')}</p>
    </div>
  );
};