import React, { useEffect, useState } from 'react'
import { useNavigate, useOutletContext  } from 'react-router-dom'
import { Link, useParams } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { getAuthUser } from '../../utils/auth.js'

export const Profile = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()
    const { username } = useParams()
    const { authUser, setAuthUser } = useOutletContext();

    useEffect(() => {
        const fetchProfile = async () => {
            const authData = await getAuthUser()
            if (!authData) {
                navigate('/login');
                return;
              }
              setAuthUser(authData)
            try {
                const url = username ? `${API_URL}/users/${username}` : `${API_URL}/users/me`;

                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                })

                if (!response.ok) {
                    console.log('Error')
                    navigate('/login')
                    return;

                }
                const data = await response.json()
                setUser(data)

                if (username && authData.username === username) {
                    navigate('/profile', { replace: true });
                }
            } catch (error) {
                console.log(error)
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate, username, setAuthUser])

    const handleLogout = async () => {
        try {

            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                setAuthUser(null)
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

    if (!user) {
        return <div>Carregant...</div>;
    }

    const isOwnProfile = !username || authUser.username === username

    return (
        <>
            <h1>{isOwnProfile ? 'Mi perfil' : `Perfil de ${user.username}`}</h1>
            <p>{`Hola soy ${user.username}`}</p>
            {isOwnProfile && (
                <>
                    <button onClick={handleLogout}>Logout</button>
                    <button><Link to="edit">Editar</Link></button>
                    <button onClick={handleDelete}>Eliminar cuenta</button>
                </>)}
        
        </>
    )
}