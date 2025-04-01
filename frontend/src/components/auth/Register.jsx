import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'

export const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const { t } = useTranslation();

    const handleRegister = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, email })
            })

            if (response.ok) {
                await response.json()
                navigate('/login')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>{t("auth.register")}</h1>
            <form onSubmit={handleRegister}>
                <label>{t("auth.username")}</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                <br />
                <label>{t("auth.password")}</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password.placeholder")} />
                <br />
                <label>{t("auth.email")}</label>
                <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <input type="submit" value={t("auth.register")} />
            </form>
        </div>
    )
}