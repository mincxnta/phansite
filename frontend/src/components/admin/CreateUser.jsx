import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const CreateUser = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
                body: JSON.stringify({ username, password, email, role })
            })

            if (response.ok) {
                await response.json()
                navigate('/admin')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>{t("user.create")}</h1>
            <form onSubmit={handleCreateUser}>
                <label>{t("username")}</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder={t("username.placeholder")} />
                <br />
                <label>{t("password")}</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder={t("password.placeholder")} />
                <br />
                <label>{t("email")}</label>
                <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <label>{t("role")}</label>
                <select value={role} required onChange={(e) => setRole(e.target.value)}>
                    <option value="fan">{t("role.fan")}</option>
                    <option value="phantom_thief">{t("role.phantom.thief")}</option>
                    <option value="admin">{t("role.admin")}</option>
                </select>
                <input type="submit" value={t("user.create")} />
            </form>
        </div>
    )
}