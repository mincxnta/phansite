import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const CreateRequest = () => {
    const [title, setTitle] = useState('')
    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth()
    const [error, setError] = useState(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    })

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleNewRequest = async (event) => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('target', target);
        if (file) {
            formData.append('image', file);
        }
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            console.log(response)
            const data = await response.json()
            if (!response.ok) {
                setError(errorHandler(data));
            }
            navigate('/requests')
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            <h1>{t("requests.add")}</h1>
            {error && t(error)}
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
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <input type="submit" value={t("requests.send")} />
            </form>
        </div>
    )
}