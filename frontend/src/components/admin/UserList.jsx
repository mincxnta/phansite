import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const UserList = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        const verifyAdmin = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'admin') {
                navigate('/');
            }
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/users`, {
                    method: 'GET',
                    credentials: 'include'
                })

                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setUsers(data)
                }
            } catch (error) {
                console.log(error.message)
                navigate('/')

            }
        }
        verifyAdmin();
        fetchUsers()
    }, [navigate, user])

    const handleBan = async (userId) => {

        try {
            const response = await fetch(`${API_URL}/users/${userId}/ban`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ banned: true })
            })

            if (response.ok) {
                await response.json()
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <h1>{t("users.list")}</h1>
            <table>
                <thead>
                    <tr>
                        <th>{t("username")}</th>
                        <th>{t("email")}</th>
                        <th>{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <button><Link to={`/profile/${user.username}`}>{user.username}</Link></button>
                            </td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => handleBan(user.id)}>{t("ban")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}