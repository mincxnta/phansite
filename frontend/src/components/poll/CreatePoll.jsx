import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const CreatePoll = () => {
    const [question, setQuestion] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()
    const [error, setError] = useState(null);
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

    const handleNewPoll = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/polls`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question })
            })

            //Si se envía vacío, devuelve ok igualmente
            const data = await response.json()
            if (!response.ok) {
                setError(errorHandler(data));
            }
            navigate('/')
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            <h1>{t("poll.new")}</h1>
            {error && <p>{t(error)}</p>}
            <form onSubmit={handleNewPoll}>
                <label>{t("poll.question")}</label>
                <input type="text" required placeholder={t("poll.question.placeholder")} value={question} onChange={(e) => setQuestion(e.target.value)} />
                <br />
                <input type="submit" value={t("poll.send")} />
            </form>
        </div>
    )
}