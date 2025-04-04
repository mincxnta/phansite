import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const UpdateUser = () => {
    const { user } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [aboutMe, setAboutMe] = useState('')
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProfile = () => {
            if (user) {
                setUsername(user.username)
                setEmail(user.email)
                setAboutMe(user.aboutMe)
            } else {
                navigate('/login')
            }
        }
        fetchProfile()
    }, [navigate, user])

    const handleUpdateUser = async (event) => {
        event.preventDefault()
        const updatedData = { username, email, aboutMe }
        if (password) {
            updatedData.password = password
        }
        try {
            const response = await fetch(`${API_URL}/users/update`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })

            const data = await response.json();
            if (response.ok) {
                navigate('/profile')
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    if (!user) {
        return <div>Carregant...</div>;
    }

    return (
        <div>
            {error && t(error)}
            <h1>{t("profile.edit")}</h1>
            <form onSubmit={handleUpdateUser}>
                <label>{t("auth.username")}</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                <br />
                <label>{t("auth.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password.placeholder")} />
                <br />
                <label>{t("auth.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <label>{t("auth.aboutMe")}</label>
                <input type="text" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} placeholder={t("auth.aboutMe.placeholder")} />
                <input type="image" />
                <input type="submit" value={t("profile.edit")} />
            </form>
        </div>
    )
}