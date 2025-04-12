import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { RequestList } from '../request/RequestList.jsx'
import { convertImageToBase64 } from '../../utils/imageUtils.js'
import { format } from 'date-fns';
import { locales } from '../../utils/dateLocales.js'

export const UserProfile = () => {
    const [profileUser, setProfileUser] = useState(null)
    const navigate = useNavigate()
    let { username } = useParams()
    const { user, logout, error: authError } = useAuth()
    const [error, setError] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username) {
                setProfileUser(user)
                username = user.username
                return;
            }
            try {
                const response = await fetch(`${API_URL}/users/${username}`, {
                    method: 'GET',
                    credentials: 'include'
                })

                if (!response.ok) {
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                console.log("Data", data)
                if (data.profilePicture) {
                        const base64Image = await convertImageToBase64(data.profilePicture);
                        data.profilePicture = base64Image;
                      }
                setProfileUser(data)

                if (user.username === username) {
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, username, user])

    const handleLogout = async () => {
        await logout();
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`${API_URL}/users/delete`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                navigate('/login')
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }
    
    if (!profileUser) {
        return <div>Cargando...</div>;
    }

    const isOwnProfile = !username || user.username === username

    return (
        <>
            {authError && t(authError)}
            {error && t(error)}
            <h1>{isOwnProfile ? t("profile.me") : t("profile.user", { username: profileUser.username })}</h1>
            <img src={profileUser.profilePicture}/>
            <p>{`${profileUser.username}`}</p>
            <p>{`${profileUser.aboutMe}`}</p>
            <p>Member since: {format(new Date(profileUser.registrationDate), 'dd-MM-yyyy', {
        locale: locales[i18n.language],
    })}</p>
            {isOwnProfile && (
                <>
                    
                    <button onClick={handleLogout}>{t("auth.logout")}</button>
                    <button><Link to="edit">{t("profile.edit")}</Link></button>
                    {/* <button onClick={handleDelete}>Eliminar cuenta</button> */}
                    {user.role === 'fan' && (
                        <>
                            <h4>{t("profile.requests")}</h4>
                            <RequestList />
                        </>
                    )}
                </>)}
                {/* Se puede ver el perfil de phantom thieves / admins ? Y mandarles mensajes? */}
                {!isOwnProfile && (
                    <button><Link to={`/chat/${profileUser.id}`}>{t("profile.message")}</Link></button>
                    )}

        </>
    )
}