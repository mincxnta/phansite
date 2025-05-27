import React, { useState, useEffect } from 'react'
import { API_URL } from '../../constants/constants.js'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { SubmitButton } from '../../components/SubmitButton.jsx';

export const CreateRequest = () => {
    const [title, setTitle] = useState('')
    const [target, setTarget] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [description, setDescription] = useState('')
    const [file, setFile] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [sending, setSending] = useState(false)

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    })

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleCancelImage = () => {
        setFile(null);
        setSelectedImage(null);
    };

    const handleNewRequest = async (event) => {
        event.preventDefault()
        setSending(true);

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
                return;
            }
            setTitle('');
            setTarget('');
            setDescription('');
            setFile(null);
            setSelectedImage(null);

            toast.success(t("success.create.request"))
            navigate('/requests')
        } catch (error) {
            toast.error(t(errorHandler(error)))
        } finally {
            setSending(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center pt-20">
                <h1 className="mt-4 mb-8 text-6xl">{t("requests.add")}</h1>
                <div className="w-75 max-w-md">
                    <form onSubmit={handleNewRequest} className="flex flex-col gap-4 ">
                        <label className="text-3xl">{t("title")}</label>
                        <div className="form-input-container form-input-1">
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("requests.title.placeholder")} className="p-3 text-lg w-full" />
                        </div>
                        <label className="text-3xl">{t("requests.target.person")}</label>
                        <div className="form-input-container form-input-2">
                            <input type="text" required value={target} onChange={(e) => setTarget(e.target.value)} placeholder={t("requests.target.placeholder")} className="p-3 text-lg w-full" />
                        </div>
                        <label className="text-3xl">{t("requests.description")}</label>
                        <div className="form-input-container form-input-3 h-[10rem]">
                            <textarea type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("requests.description.placeholder")} className="p-3 text-lg w-[90%] resize-none h-full" />
                        </div>
                        <label className="text-3xl">{t("requests.target.image")}</label>
                        {selectedImage &&
                            <div>
                                <img src={selectedImage} className="border-3 border-white" />
                            </div>
                        }

                        {!selectedImage ?
                            <>
                                <div className='flex justify-center '>
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <img
                                            src="/assets/images/icons/upload.png"
                                            alt={t("photo.discard")}
                                            className='h-10'
                                        />
                                    </label>
                                </div>
                                <input type="file" accept="image/*" id="image-upload"
                                    onChange={handleFileChange} className="hidden" /> </> : (
                                <div>
                                    <button type="button" onClick={handleCancelImage}>
                                        <img
                                            src="/assets/images/icons/delete.png"
                                            alt={t("photo.discard")}
                                            className='h-8'
                                        />
                                    </button>
                                </div>
                            )}
                        <SubmitButton disabled={sending} text={t('send')}></SubmitButton>
                    </form>
                </div>
            </div>
        </div >
    )
}