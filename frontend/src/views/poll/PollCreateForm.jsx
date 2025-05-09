import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const PollCreateForm = () => {
    const [questionEs, setQuestionEs] = useState('')
    const [questionEn, setQuestionEn] = useState('')
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
                body: JSON.stringify({ questionEs, questionEn })
            })

            const data = await response.json()
            if (!response.ok) {
                toast.error(t(errorHandler(data)))
            }
            toast.success(t("success.create.poll"))
            navigate('/')
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="mb-8 text-6xl">{t("poll.new")}</h1>
            <div className="w-75 max-w-md">
                <form onSubmit={handleNewPoll} className="flex flex-col gap-4">
                    <label className='text-3xl'>{t("poll.question.es")}</label>
                    <div className="form-input-container form-input-1">
                        <input
                            type="text"
                            required
                            placeholder={t("poll.question.placeholder")}
                            value={questionEs}
                            onChange={(e) => setQuestionEs(e.target.value)}
                            className="p-3 text-lg w-full"
                        />
                    </div>
                    <label className='text-3xl'>{t("poll.question.en")}</label>
                    <div className="form-input-container form-input-2 mb-8">
                        <input
                            type="text"
                            required
                            placeholder={t("poll.question.placeholder")}
                            value={questionEn}
                            onChange={(e) => setQuestionEn(e.target.value)}
                            className="p-3 text-lg w-full"
                        />
                    </div>
                    <SubmitButton text={t('poll.send')}></SubmitButton>
                </form>
            </div>
        </div>
    )
}