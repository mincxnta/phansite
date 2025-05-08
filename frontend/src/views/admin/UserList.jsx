import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { toast } from 'react-toastify';
import { Table } from '../../components/Table.jsx';
import { Pagination } from '../../components/Pagination.jsx';
import { SubmitButton } from '../../components/SubmitButton.jsx';

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

    const handleBanClick = (userId) => {
        showConfirmToast(
          t('confirmToast.banMessage'),
          () => handleBan(userId),
          () => {}
        );
      };

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
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const headers = [
        t("auth.username"),
        t("auth.email"),
        t("admin.actions")
    ];

    // Definir les files de la taula
    const rows = users.map((user) => [
        <button><Link to={`/profile/${user.username}`}>{user.username}</Link></button>,
        user.email,
        <button title={t("admin.ban")} onClick={() => handleBanClick(user.id)}>{t("admin.ban")}</button>
    ]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div class="flex items-center justify-between w-full max-w-[85%] mb-8">
            <h1>{t("users.list")}</h1>
            <SubmitButton to="/admin/create" text={t("users.create")} />
            </div>
            <Table headers={headers} rows={rows} />
            {totalPages > 1 && (
                <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            )}
        </div>
    )
}