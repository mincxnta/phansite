import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'

export const Profile = () => {
    const [profileUser, setProfileUser] = useState(null)
    const navigate = useNavigate()
    let { username } = useParams()
    const { user } = useAuth()

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
                    console.log('Error')
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                setProfileUser(data)

                if (user.username === username) {
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                console.log(error)
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, username, user])

    const handleLogout = async () => {
        try {

            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                setProfileUser(null)
                navigate('/login')
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
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
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (!profileUser) {
        return <div>Carregant...</div>;
    }

    const isOwnProfile = !username || user.username === username

    return (
        <>
            <h1>{isOwnProfile ? 'Mi perfil' : `Perfil de ${profileUser.username}`}</h1>
            <p>{`Hola soy ${profileUser.username}`}</p>
            {isOwnProfile && (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <button><Link to="edit">Editar</Link></button>
                    <button onClick={handleDelete}>Eliminar cuenta</button>
                </>)}

        </>
    )
}