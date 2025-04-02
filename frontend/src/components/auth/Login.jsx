import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext.jsx';
import { errorHandler } from '../../utils/errorHandler.js';

export const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || "/";

    const handleLogin = async (event) => {
        event.preventDefault()
        setError('');
        try {
            //TODO Manejar errores
            await login(username, password);
            navigate(from, { replace: true });
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            <h1>{t("auth.login")}</h1>
            <form onSubmit={handleLogin}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <label>{t("auth.username")}</label>
                <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                <br />
                <label>{t("auth.password")}</label>
                <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password.placeholder")} />

                <input type="submit" value={t("auth.login")} />
                <Link to="/register">{t("auth.register")}</Link>
            </form>
        </div>
    )
}