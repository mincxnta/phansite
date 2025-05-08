import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const UserCreateForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        const verifyAdmin = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'admin') {
                navigate('/');
            }
        }
        verifyAdmin();
    }, [navigate, user])

    const handleCreateUser = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/admin/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, confirmPassword, email, role })
            })
            const data = await response.json()
            if (response.ok) {
                toast.success(t("success.create.user"))
                navigate('/admin/users')
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="mb-8 text-border">{t("users.create")}</h1>
            <div className="w-75 max-w-md">
                <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
                    <div className="form-input-container form-input-1">
                        <input
                            type="text"
                            value={username}
                            required
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder={t("auth.username.placeholder")}
                            className="p-3 text-lg w-full" />
                    </div>
                    <div className="form-input-container form-input-3 relative">
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
                    <div className="form-input-container form-input-4 relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('auth.confirm.password.placeholder')}
                            className="p-3 text-lg w-full"
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
                    <div className="form-input-container form-input-2">
                        <input
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="phantom@aficionado.xyz"
                            className="p-3 text-lg w-full"
                        />
                    </div>
                    <select value={role} required onChange={(e) => setRole(e.target.value)} className="p-3 text-lg text-center form-input-container form-input-1">
                        <option value="" disabled hidden>{t("role.title")}</option>
                        <option value="fan">{t("role.fan")}</option>
                        <option value="phantom_thief">{t("role.phantom.thief")}</option>
                        <option value="admin">{t("role.admin")}</option>
                    </select>
                    <SubmitButton text={t('users.create')}></SubmitButton>
                </form>
            </div>
        </div>
    )
}