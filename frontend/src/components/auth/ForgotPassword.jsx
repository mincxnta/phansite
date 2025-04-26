import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { errorHandler } from '../../utils/errorHandler.js';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(t(errorHandler(data)));
      } else {
        toast.success(t('success.email.verification.sent'));
      }
    } catch (error) {
      toast.error(t(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{t('auth.forgot.password')}</h2>
      <p>{t('auth.forgot.password.instructions')}</p>

      <form onSubmit={handleSubmit}>
        <label>{t("auth.email")}</label>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('auth.email.placeholder')}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? t('auth.sending') : t('auth.send.reset.link')}
        </button>
      </form>

      <div>
        <Link to="/login">{t('auth.login')}</Link>
      </div>
    </div>
  );
};