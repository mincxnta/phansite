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
    const { user, setUser } = useAuth()
    const [username, setUsername] = useState('')
    const [selectedImage, setSelectedImage] = useState(null)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [file, setFile] = useState(null)
    const [aboutMe, setAboutMe] = useState('')
    const [loading, setLoading] = useState(false)
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
        setLoading(true);

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
                setUser(data)
                toast.success(t("success.update.profile"))
                navigate('/profile')
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        } finally {
            setLoading(false)
        }
    }

    if (!user) {
        return <Loading />;
    }

    return (
        <div className="h-[90vh] flex flex-col justify-center">
            <h1>{t("profile.edit")}</h1>
            <form onSubmit={handleUpdateUser} className="flex items-center justify-center mt-3 gap-15">
                <div className="flex items-center flex-col h-[40vh]">
                    <div className="border-10 border-black skew-x-4 mb-3  w-[350px] h-[350px]">
                        <img className="w-full h-full object-cover" src={selectedImage || user.profilePicture || '/assets/requests/unknownTarget.png'} />
                    </div>

                    {!selectedImage ?
                        (<><label htmlFor="image-upload" className="cursor-pointer">
                            <img
                                src="/assets/images/icons/upload.png"
                                alt={t("photo.discard")}
                                className='h-10'
                            /></label>
                            <input type="file" accept="image/*" id="image-upload" onChange={handleFileChange} style={{ display: 'none' }} /></>) : (
                            <button type="button" onClick={handleCancelImage}>
                                <img
                                    src="/assets/images/icons/delete.png"
                                    alt={t("photo.discard")}
                                    className='h-8'
                                />
                            </button>
                        )}
                </div>
                <div>
                    <div className="h-[35vh] w-[25vw] bg-white -skew-x-3 box-shadow flex items-center justify-center">
                        <textarea className="text-black text-3xl vertical-align" type="text" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} placeholder={t("auth.aboutMe.placeholder")} style={{ resize: "none", width: "90%", height: "100%" }}
                        />
                    </div>
                </div>
                <div>
                    <div className="form-input-container form-input-1 mb-2">
                        <input className="p-3 text-lg w-full" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t("auth.username.placeholder")} />
                    </div>
                    <div className="form-input-container form-input-3 relative mb-2">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('auth.password.placeholder')}
                            className="py-3 pr-13 text-lg w-[90%]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <img src={showPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                                className="h-8 w-auto cursor-pointer" />
                        </button>
                    </div>
                    <div className="form-input-container form-input-4 relative mb-2">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t('auth.confirm.password.placeholder')}
                            className="py-3 pr-13 text-lg w-[90%]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <img src={showConfirmPassword ? '../../assets/images/icons/show.png' : '../../assets/images/icons/hide.png'}
                                className="h-8 w-auto cursor-pointer" />
                        </button>
                    </div>
                    <div className="form-input-container form-input-3 mb-2">
                        <input className="p-3 text-lg w-full" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="phantom@aficionado.xyz" />
                    </div>
                    <SubmitButton text={loading ? t("profile.saving") : t("profile.save")}></SubmitButton>
                </div>
            </form>
        </div>
    )
}