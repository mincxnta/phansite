import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'


export const Profile = () => {
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/users/profile', {
                    method: 'GET',
                    credentials: 'include'
                })

                if (response.ok) {
                    const data = await response.json()
                    setUser(data)
                } else {
                    console.log('Error')
                    navigate('/login')
                }
            } catch (error) {
                console.log(error)
                navigate('/')

            }
        }
        fetchProfile()
    }, [navigate])

    if (!user) {
        return <div>Carregant...</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>{`Hola soy ${user.username}`}</p>
        </div>
    )
}