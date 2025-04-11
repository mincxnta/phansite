import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { convertImageToBase64 } from '../../utils/imageUtils.js';

export const UpdateUser = () => {
    const { user } = useAuth()
    const [username, setUsername] = useState('')
    const [profilePicture, setProfilePicture] = useState(null)
    const [selectedImage, setSelectedImage] = useState(null)
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const [aboutMe, setAboutMe] = useState('')
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                setUsername(user.username)
                setEmail(user.email)
                setAboutMe(user.aboutMe)

                if (user.profilePicture) {
                    const base64Image = await convertImageToBase64(user.profilePicture);
                    setProfilePicture(base64Image)
                }
                
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

        // Convertir la nova imatge seleccionada a Base64 per a la previsualització
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result); // reader.result és la cadena Base64
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

            const data = await response.json();
            if (response.ok) {
                navigate('/profile')
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    if (!user) {
        return <div>Carregant...</div>;
    }

    return (
        <div>
            {error && t(error)}
            <h1>{t("profile.edit")}</h1>
            <form onSubmit={handleUpdateUser}>
                <div>
                    <img src={selectedImage || profilePicture || '/assets/requests/unknownTarget.png'} />
                </div>
                
                    {profilePicture && !selectedImage ? 
                    (<label><p>Subir foto</p>
                    <input type="file" accept="image/*" onChange={handleFileChange}  style={{ display: 'none' }}/></label>):(
                        <button type="button" onClick={handleCancelImage}>
                        Cancelar foto
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

                <input type="submit" value={t("profile.edit")} />
            </form>
        </div>
    )
}