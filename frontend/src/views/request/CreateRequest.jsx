import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';

export const CreateRequest = () => {
    const [title, setTitle] = useState('')
    const [target, setTarget] = useState('')
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth()
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
            formData.append('targetImage', file);
        }
        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })

            if (response.status == 500) {
                const text = await response.text();
                if (text.includes("Invalid file type")) {
                    toast.error(t('error.invalid.file.type'));
                    return;
                }
            }

            const data = await response.json()
            if (!response.ok) {
                toast.error(t(errorHandler(data)))
            }
            toast.success(t("success.create.request"))
            navigate('/requests')
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    return (
        <div>
            <h1>{t("requests.add")}</h1>
            <form onSubmit={handleNewRequest}>
                <label>{t("title")}</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("requests.title.placeholder")} />
                <br />
                <label>{t("requests.target.person")}</label>
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