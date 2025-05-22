import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { errorHandler } from '../../utils/errorHandler.js';
import { SubmitButton } from '../../components/SubmitButton.jsx';

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
    <div className="min-h-screen flex flex-col items-center justify-center form-background">
      <h1 className="mb-4 forgot-password-title text-[4rem] sm:text-[5rem] ">{t('auth.forgot.password')}</h1>
      <h2 className="text-xl mb-8">{t('auth.forgot.password.instructions')}</h2>
      <div className="w-75 max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-input-container form-input-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.email.placeholder')}
              disabled={isLoading}
              className="p-3 text-lg w-full"
            />
          </div>
          <SubmitButton text={isLoading ? t('auth.sending') : t('auth.send.reset.link')}></SubmitButton>
        </form>
        <div>
          <p>{t("auth.already.registered")} <Link to="/login" className="text-red-600">{t('auth.login')}</Link></p>
        </div>
      </div>
    </div>
  );
};