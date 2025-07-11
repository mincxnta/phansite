import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { SubmitButton } from '../../components/SubmitButton.jsx';
export const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, confirmPassword, email })
            })

            const data = await response.json()
            if (response.ok) {
                toast.success(t('success.register'))
                navigate('/login')
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center form-background">
            <h1 className="mb-8 text-[4rem] sm:text-[5rem]">{t('auth.register')}</h1>
            <div className="w-75 max-w-md">
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="form-input-container form-input-1">
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('auth.email.placeholder')}
                            className="p-3 text-lg w-full"
                        />
                    </div>
                    <div className="form-input-container form-input-2">
                        <input
                            type="text"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t('auth.username.placeholder')}
                            className="p-3 text-lg w-full"
                        />
                    </div>
                    <div className="form-input-container form-input-3 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.password.placeholder')}
                            className="py-3 pr-13 text-lg w-[90%]"
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
                    <div className="form-input-container form-input-4 relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('auth.confirm.password.placeholder')}
                            className="py-3 pr-13 text-lg w-[90%]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <img src={showConfirmPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                                className="h-8 w-auto cursor-pointer" />
                        </button>
                    </div>
                    <SubmitButton disabled={isLoading} text={t('auth.register')}></SubmitButton>
                </form>
                <p>{t("auth.already.registered")} <Link to="/login" className="link-hover underline">{t('auth.login')}</Link></p>
            </div>
        </div>
    );
};