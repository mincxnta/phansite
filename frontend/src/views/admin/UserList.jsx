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
    const [originalUsers, setOriginalUsers] = useState([])
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 5;
    const [sortOrderUsername, setSortOrderUsername] = useState('');
    const [sortOrderEmail, setSortOrderEmail] = useState('')
    const [sortColumn, setSortColumn] = useState('')
    const [searchQuery, setSearchQuery] = useState('');

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
                    setOriginalUsers(data.users)
                    setTotalPages(data.totalPages);
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
            t('toast.ban'),
            () => handleBan(userId),
            () => { }
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
                return;
            }
            toast.success(t("success.user.banned"))
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === userId ? { ...u, banned: true } : u
                )
            );
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const sortUsers = (column) => {
        let newSortOrder = column === 'username' ? sortOrderUsername : sortOrderEmail;

        if (column === 'username') {
            newSortOrder = sortOrderUsername === '' ? 'asc' : sortOrderUsername === 'asc' ? 'desc' : '';
            setSortOrderUsername(newSortOrder);
            setSortColumn(column);
        } else if (column === 'email') {
            newSortOrder = sortOrderEmail === '' ? 'asc' : sortOrderEmail === 'asc' ? 'desc' : '';
            setSortOrderEmail(newSortOrder);
            setSortColumn(column);
        }

        if (newSortOrder === '') {
            setUsers([...originalUsers]);
            setSortColumn('');
            return;
        }

        const sortedUsers = [...users].sort((a, b) => {
            const valueA = a[column].toLowerCase();
            const valueB = b[column].toLowerCase();
            return newSortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
        });

        setUsers(sortedUsers);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setUsers([...originalUsers]);
            return;
        }
        const filteredUsers = originalUsers.filter((user) =>
            user.username.toLowerCase().includes(query.toLowerCase())
        );
        setUsers(filteredUsers);
    };

    const headers = [
        <button className="flex"
            onClick={() => sortUsers('username')}
        >
            {t('auth.username')}
            <img
                src={`/assets/images/icons/sort${sortOrderUsername === '' ? '' : sortOrderUsername === 'asc' ? '-asc' : '-desc'}.png`}
                className="w-8"
            />
        </button>,
        <button className="flex"
            onClick={() => sortUsers('email')}
        >
            {t('auth.email')}
            <img
                src={`/assets/images/icons/sort${sortOrderEmail === '' ? '' : sortOrderEmail === 'asc' ? '-asc' : '-desc'}.png`}
                className="w-8" />
        </button>,
        t("admin.actions")
    ];

    const rows = users.map((user) => [
        <button className={user.banned ? "" : "w-full table-text"}><Link to={`/profile/${user.username}`} className={user.banned ? 'line-through text-red-500' : ''}>{user.username}</Link></button>,
        user.email,
        !user.banned ? (<button title={t("admin.ban")} onClick={() => handleBanClick(user.id)}><img className="w-8 button-hover" src="/assets/images/icons/ban.png" /></button>) : ('')
    ]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="flex items-center flex-col sm:flex-row justify-between w-full max-w-[85%] mb-8">
                <h1 className='text-[4rem] sm:text-[5rem] mb-3 sm:mb-0'>{t("users.title")}</h1>
                <div className="flex items-center gap-8 ">
                    <div className="flex items-center bg-white text-black p-2 -skew-x-6  w-full sm:w-64 gap-2">
                    <img
                        src="/assets/images/icons/search.png"
                        className="w-6 h-6"
                        alt="Search Icon"
                    />
                    <input
                        type="text"
                        placeholder={t("search.title")}
                        value={searchQuery}
                        className="w-full bg-transparent focus:outline-none"
                        onChange={(e) => handleSearch(e.target.value)}
                        
                    />
                    
                    </div>
                    <SubmitButton className="mb-6" to="/admin/create" text={t("users.create")} />
                </div>
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