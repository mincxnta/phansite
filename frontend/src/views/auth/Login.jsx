import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { API_URL } from '../../constants/constants.js'
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (event) => {
    event.preventDefault();
    const data = await login(email, password);
    if (data === true) {
      toast.success(t("success.login"))
      navigate(from, { replace: true });
    } else {
      toast.error(t(errorHandler(data)))
      if (data.code === 'email_not_verified') {
        const toastId = toast.info(
          <div>
            {t('error.email.not.verified')}
            <br />
            <button
              onClick={() => handleResendVerification(toastId)}
              disabled={isResending}
            >
              {isResending ? t('auth.resending') : t('auth.resend.verification')}
            </button>
          </div>,
          { autoClose: false }
        );
      }
    }
  }

  const handleResendVerification = async (toastId) => {
    setIsResending(true);
    try {
      const response = await fetch(`${API_URL}/auth/resend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error(t(errorHandler(data)));
      } else {
        toast.success(t('success.email.resend'));
      }
    } catch (error) {
      toast.error(t(errorHandler(error.code)));
    } finally {
      setIsResending(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center form-background">
      <h1 className="mb-8 sign-up-title">{t("auth.login")}</h1>
      <div className="w-75 max-w-md">
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="form-input-container form-input-2">
            <input
              type="text" value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.email.placeholder")}
              className="p-3 text-lg w-full" />
          </div>
          <div className="form-input-container form-input-1 relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.password.placeholder')}
              className="p-3 text-lg w-full"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <img src={showPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                className="h-8 w-auto cursor-pointer" />
            </button>
          </div>
          <SubmitButton
            text={t('auth.login')}
            
            >
          </SubmitButton>
          <Link to="/forgot-password">{t("auth.forgot.password")}</Link>
          <p>{t("auth.not.registered")} <Link to="/register" className="text-red-600">{t("auth.register")}</Link></p>
        </form>
      </div>
    </div>
  )
}