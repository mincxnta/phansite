import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../utils/errorHandler.js';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [resend, setResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const verifyToken = async (token) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ verificationToken: token })
      })

      if (!response.ok) {
        const data = await response.json();
        setResend(data.code === 'token_expired');
        toast.error(t(errorHandler(data)));
      } else {
        toast.success(t('success.email.verified'));
        navigate('/login')
      }
    } catch (error) {
      toast.error(t(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code) {
      toast.error(t('error.missing.verification.token'));
      return;
    }
    verifyToken(code);
  };

  const handleResend = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/resend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        const data = await response.json();
        toast.error(t(errorHandler(data)));
      } else {
        toast.success(t('success.email.verification.sent'));
        setResend(false);
      }

    } catch (error) {
      toast.error(t(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center form-background">
      <h1 className="mb-8">{t("verify.email.title")}</h1>
      {!resend && (
        <>
          <h2 className="text-xl mb-8">{t("verify.email.message")}</h2>
          <div className="w-75 max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="form-input-container form-input-1">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t("verify.email.code.placeholder")}
                  disabled={isLoading}
                  className="p-3 text-lg w-full"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="form-submit-container form-input-1 py-3 px-6 text-3xl mb-6 self-center"
              >
                {isLoading ? t("verify.email.verifying") : t("verify.email.verify")}
              </button>
            </form>
          </div>
        </>
      )}

      {resend && (
        <>
          <h2 className="text-xl mb-8">{t("verify.email.expired")}</h2>
          <div className="w-75 max-w-md">
            <form onSubmit={handleResend} className="flex flex-col gap-6">
              <div className="form-input-container form-input-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.email.placeholder")}
                  disabled={isLoading}
                  className="p-3 text-lg w-full"
                />
              </div>
              <SubmitButton text={isLoading ? t("verify.email.sending") : t("verify.email.resend")}></SubmitButton>
            </form>
          </div>
        </>
      )}
    </div>
  );
};