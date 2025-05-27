import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../assets/styles/LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const languages = ['en', 'es'];
  const [currentIndex, setCurrentIndex] = useState(languages.indexOf(i18n.language) || 0);

  const toggleLanguage = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % languages.length
      : (currentIndex - 1 + languages.length) % languages.length;

    const newLanguage = languages[newIndex];
    setCurrentIndex(newIndex);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div className="table-text w-full" onClick={() => toggleLanguage('prev')}>
      <button className="flex items-center justify-start gap-2 px-8" >
        <img className="w-5 h-auto" src="/assets/images/icons/language.png" />
        <span >{t(`language.${languages[currentIndex]}`)}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;