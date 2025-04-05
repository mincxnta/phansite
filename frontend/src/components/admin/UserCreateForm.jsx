import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const UserCreateForm = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [error, setError] = useState(null)

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
                body: JSON.stringify({ username, password, email, role })
            })
            const data = await response.json()
            if (response.ok) {
                navigate('/admin')
            } else {
                setError(errorHandler(data))
            }
        } catch (error) {
            setError(errorHandler(error))
        }
    }

    return (
        <div>
            <h1>{t("users.create")}</h1>
            {error && <p style={{ color: "red" }}>{t(`errors.${error}`)}</p>}
            <form onSubmit={handleCreateUser}>
                <label>{t("auth.username")}</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                <br />
                <label>{t("auth.password")}</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password.placeholder")} />
                <br />
                <label>{t("auth.email")}</label>
                <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <label>{t("role.title")}</label>
                <select value={role} required onChange={(e) => setRole(e.target.value)}>
                    <option value="fan">{t("role.fan")}</option>
                    <option value="phantom_thief">{t("role.phantom.thief")}</option>
                    <option value="admin">{t("role.admin")}</option>
                </select>
                <input type="submit" value={t("users.create")} />
            </form>
        </div>
    )
}