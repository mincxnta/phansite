import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const UserList = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [error, setError] = useState(null);

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

                const data = await response.json()
                if (response.ok) {
                    setUsers(data)
                }else{
                    setError(errorHandler(data));
                }
            } catch (error) {
                setError(errorHandler(error));

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

            const data = await response.json()
            if (!response.ok) {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            <h1>{t("users.list")}</h1>
            {error && <p>{t(error)}</p>}
            <table>
                <thead>
                    <tr>
                        <th>{t("auth.username")}</th>
                        <th>{t("auth.email")}</th>
                        <th>{t("admin.actions")}</th>
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
                                <button onClick={() => handleBan(user.id)}>{t("admin.ban")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}