import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const AddPoll = () => {
    const [question, setQuestion] = useState('')
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

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            await response.json()
            navigate('/')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>{t("poll.new")}</h1>
            <form onSubmit={handleNewPoll}>
                <label>{t("question")}</label>
                <input type="text" required placeholder={t("question.placeholder")} value={question} onChange={(e) => setQuestion(e.target.value)} />
                <br />
                <input type="submit" value={t("poll.send")} />
            </form>
        </div>
    )
}