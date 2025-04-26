import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants/constants.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../utils/errorHandler.js';

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
        console.log(data)
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
    <div>
      <h2>{t("verify.email.title")}</h2>
      {!resend && (
        <>
          <p>{t("verify.email.message")}</p>

          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={t("verify.email.code.placeholder")}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t("verify.email.verifying") : t("verify.email.verify")}
            </button>
          </form>
        </>
      )}

      {resend && (
        <div>
          <p>{t("verify.email.expired")}</p>
          <form onSubmit={handleResend}>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("auth.email.placeholder")}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? t("verify.email.sending") : t("verify.email.resend")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};