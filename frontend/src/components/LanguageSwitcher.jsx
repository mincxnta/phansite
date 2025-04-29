import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/settings/LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const languages = ['en', 'es'];
  const [currentIndex, setCurrentIndex] = useState(languages.indexOf(i18n.language) || 0);

  // const changeLanguage = (lng) => {
  //   i18n.changeLanguage(lng);
  // };

  const toggleLanguage = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % languages.length
      : (currentIndex - 1 + languages.length) % languages.length;

    const newLanguage = languages[newIndex];
    setCurrentIndex(newIndex);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div onClick={() => toggleLanguage('prev')}>
      <span >{t(`language.${languages[currentIndex]}`)}</span>
      {/* <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="en">{t('language.en')}</option>
        <option value="es">{t('language.es')}</option>
      </select> */}
    </div>
  );
};

export default LanguageSwitcher;