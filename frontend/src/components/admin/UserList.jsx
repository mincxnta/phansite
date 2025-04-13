import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
//import { showPopUp } from '../popups/PopUp.jsx'
import { toast } from 'react-toastify';

export const UserList = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const limit = 5;

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
                const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()

                if (response.ok) {
                    setUsers(data.users)
                    setTotalPages(data.totalPages);
                    setTotalUsers(data.totalUsers);
                } else {
                    toast.error(t(errorHandler(data)))
                }
            } catch (error) {
                toast.error(t(errorHandler(error)))

            }
        }
        verifyAdmin();
        fetchUsers()
    }, [navigate, user, page, t])

    const handleBan = async (userId) => {

        try {
            const response = await fetch(`${API_URL}/users/ban/${userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ banned: true })
            })

            const data = await response.json()
            if (!response.ok) {
                toast.error(t(errorHandler(data)))
            }
            toast.success(t("success.user.banned"))
            //showPopUp("Usuario baneado correctamente");
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    return (
        <div>
            <h1>{t("users.list")}</h1>
            <h5>{t("users.create")}</h5>
            <button> <Link to="/admin/create">{t("users.create")}</Link></button>
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
            {totalPages > 1 && (
                <div>
                    <h4>{t("users.title")}: ({totalUsers})</h4>

                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        {t("previous")}
                    </button>
                    <span>
                        {t('pagination', { page, totalPages })}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        {t("next")}
                    </button>
                </div>
            )}
        </div>
    )
}