import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx'
import { SubmitButton } from '../../components/SubmitButton.jsx'

export const UpdateUser = () => {
    const { user } = useAuth()
    const [username, setUsername] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const [aboutMe, setAboutMe] = useState('')
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                setUsername(user.username)
                setEmail(user.email)
                setAboutMe(user.aboutMe)
            } else {
                navigate('/login')
            }
        }
        fetchProfile()
    }, [navigate, user])

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

    const handleUpdateUser = async (event) => {
        event.preventDefault()

        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('aboutMe', aboutMe);

        if (file) {
            formData.append('profilePicture', file);
        }

        if (password) {
            formData.append('password', password);
        }
        try {
            const response = await fetch(`${API_URL}/users/update`, {
                method: 'PATCH',
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
            const data = await response.json();
            if (response.ok) {
                toast.success(t("success.update.profile"))
                navigate('/profile')
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    if (!user) {
        return <Loading />;
    }

    return (
        <div>
            <h1>{t("profile.edit")}</h1>
            <form onSubmit={handleUpdateUser}>
                <div>
                    <img src={selectedImage || user.profilePicture || '/assets/requests/unknownTarget.png'} />
                </div>

                {!selectedImage ?
                    (<label><p>{t("photo.upload")}</p>
                        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} /></label>) : (
                        <button type="button" onClick={handleCancelImage}>
                            {t("photo.discard")}
                        </button>
                    )}

                <label>{t("auth.username")}</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                <br />
                <label>{t("auth.password")}</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("auth.password.placeholder")} />
                <br />
                <label>{t("auth.email")}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                <label>{t("profile.about.me")}</label>
                <input type="text" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} placeholder={t("auth.aboutMe.placeholder")} />
                <SubmitButton text={t("profile.save")}></SubmitButton>
            </form>
        </div>
    )
}