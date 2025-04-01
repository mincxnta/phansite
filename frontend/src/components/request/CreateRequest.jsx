import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const CreateRequest = () => {
    const [title, setTitle] = useState('')
    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        if (!user) {
            console.log('Error')
            navigate('/login')
        }
    })
    
    const handleNewRequest = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, target, description })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            await response.json()
            navigate('/requests')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>{t("requests.add")}</h1>
            <form onSubmit={handleNewRequest}>
                <label>{t("title")}</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("requests.title.placeholder")} />
                <br />
                <label>{t("requests.target")}</label>
                <input type="text" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder={t("requests.target.placeholder")} />
                <br />
                <label>{t("requests.description")}</label>
                <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("requests.description.placeholder")} />
                <br />
                <label>{t("requests.target.image")}</label>
                <input type="image" value={image} onChange={(e) => setImage(e.target.value)} />
                <input type="submit" value={t("requests.send")} />
            </form>
        </div>
    )
}