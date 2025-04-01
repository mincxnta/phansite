import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const UpdateUser = () => {
    const {user} = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (user){
                    setUsername(user.username)
                    setEmail(user.email)
                } else {
                    console.log('Error')
                    navigate('/login')
                }
            } catch (error) {
                console.log(error)
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, user])

    const handleUpdateUser = async (event) => {
        event.preventDefault()
        const updatedData = { username, email }
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

            if (response.ok) {
                await response.json()
                navigate('/profile')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (!user) {
        return <div>Carregant...</div>;
    }

    return (
        <div>
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
                <input type="image" />
                <input type="submit" value={t("profile.edit")} />
            </form>
        </div>
    )
}