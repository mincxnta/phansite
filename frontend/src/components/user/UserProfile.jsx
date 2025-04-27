import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'
import { RequestList } from '../request/RequestList.jsx'
import { format } from 'date-fns';
import { locales } from '../../utils/dateLocales.js'
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler.js';
import { Loading } from '../Loading.jsx'

export const UserProfile = () => {
    const [profileUser, setProfileUser] = useState(null)
    const navigate = useNavigate()
    let { username } = useParams()
    const { user, logout, error: authError } = useAuth()
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!username && user) {
                setProfileUser(user)
                username = user.username
                return;
            }
            try {
                const response = await fetch(`${API_URL}/users/${username}`, {
                    method: 'GET',
                    // credentials: 'include'
                })

                if (!response.ok) {
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                setProfileUser(data)

                if (user && user.username === username) {
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                toast.error(t(errorHandler(error)))
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, username, user])

    const handleLogout = async () => {
        await logout();
        toast.success(t("success.logout"))
    }

    // const handleDelete = async () => {
    //     try {
    //         const response = await fetch(`${API_URL}/users/delete`, {
    //             method: 'DELETE',
    //             credentials: 'include'
    //         })

    //         if (response.ok) {
    //             await response.json()
    //             navigate('/login')
    //         }
    //     } catch (error) {
    //         setError(errorHandler(error));
    //     }
    // }

    if (!profileUser) {
        return <Loading />;
    }

    const isOwnProfile = !username || user && user.username === username

    const formattedDate = format(new Date(profileUser.registrationDate), 'dd-MM-yyyy', {
        locale: locales[i18n.language],
    });

    return (
        <>
            {authError && t(authError)}
            <h1>{isOwnProfile ? t("profile.me") : t("profile.user", { username: profileUser.username })}</h1>
            <img src={profileUser.profilePicture || '/assets/requests/unknownTarget.png'} />
            <p>{`${profileUser.username}`}</p>
            <p>{`${profileUser.aboutMe}`}</p>
            <p>{t("profile.date", { date: formattedDate })}</p>
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
                <button><Link to={`/chat/${profileUser.username}`}>{t("profile.message")}</Link></button>
            )}

        </>
    )
}