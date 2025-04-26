import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { errorHandler } from '../../utils/errorHandler.js';

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
      toast.error(t('missing.token'));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(t(errorHandler(data)));
      } else {
        toast.success(t("success.password.reset"));
        navigate('/login');
      }
    } catch (error) {
      toast.error(t(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>{t('auth.reset.password')}</h2>
      <p>{t('auth.reset.password.instructions')}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>{t("auth.new.password")}</label>
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t('auth.new.password.placeholder')}
            disabled={isLoading}
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>Hide</button>
        </div>
        <div>
          <label>{t("auth.confirm.new.password")}</label>
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t('auth.confirm.new.password.placeholder')}
            disabled={isLoading}
          />
          <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>Hide</button>
        </div>
        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? t('auth.resetting') : t('auth.reset.password')}
        </button>
      </form>
    </div>
  );
};