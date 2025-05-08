import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../../constants/constants.js';
import { errorHandler } from '../../utils/errorHandler.js';
import { SubmitButton } from '../../components/SubmitButton.jsx';

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
    <div className="min-h-screen flex flex-col items-center justify-center form-background">
      <h1 className="mb-8 sign-up-title">{t('auth.reset.password')}</h1>
      <h2 className="text-xl mb-8">{t('auth.reset.password.instructions')}</h2>
      <div className="w-75 max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="form-input-container form-input-1 relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('auth.new.password.placeholder')}
              disabled={isLoading}
              className="p-3 text-md w-full"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2">
              <img src={showNewPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                className="h-8 w-auto cursor-pointer" />
            </button>
          </div>
          <div className="form-input-container form-input-2 relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('auth.confirm.new.password.placeholder')}
              disabled={isLoading}
              className="p-3 text-md w-full"
            />
            <button
              type="button"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2">
              <img src={showConfirmNewPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                className="h-8 w-auto cursor-pointer" />
            </button>
          </div>
          <SubmitButton text={isLoading ? t('auth.resetting') : t('auth.reset.password')}></SubmitButton>
        </form>
      </div>
    </div>
  );
};