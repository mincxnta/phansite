import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const Profile = () => {
    const [profileUser, setProfileUser] = useState(null)
    const navigate = useNavigate()
    let { username } = useParams()
    const { user, logout } = useAuth()
    const [error, setError] = useState(null);
    const { t } = useTranslation();

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
        logout();
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
        return <div>Carregant...</div>;
    }

    const isOwnProfile = !username || user.username === username

    return (
        <>
        {error && t(error)}
            <h1>{isOwnProfile ? t("profile.me") : `Perfil de ${profileUser.username}`}</h1>
            <p>{`Hola soy ${profileUser.username}`}</p>
            {isOwnProfile && (
                <>
                    <button onClick={handleLogout}>{t("auth.logout")}</button>
                    <button><Link to="edit">{t("profile.edit")}</Link></button>
                     <button onClick={handleDelete}>Eliminar cuenta</button> {/*//TODO Se quita? */}
                </>)}

        </>
    )
}