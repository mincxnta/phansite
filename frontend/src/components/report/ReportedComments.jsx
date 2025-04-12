import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { showPopUp } from '../popups/PopUp.jsx';
import { toast } from 'react-toastify';

export const ReportedComments = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const limit = 5;

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/reports/type?type=comment&page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()
            if (response.ok) {
                setReports(data.reports);
                setTotalPages(data.totalPages);
                setTotalReports(data.totalReports);
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    useEffect(() => {

        fetchReports()
    }, [navigate, page])

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
            showPopUp("Usuario baneado satisfactoriamente");
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const handleDiscard = async (id) => {
        try {
            const response = await fetch(`${API_URL}/reports/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                await response.json()
                setReports((prevReports) => prevReports.filter(report => report.id !== id));
                setTotalReports(prev => prev - 1);
                await fetchReports();
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const handleDelete = async (report) => {
        handleDiscard(report.id);
        try {
            const response = await fetch(`${API_URL}/comments/${report.comment.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                setReports((prevReports) => prevReports.filter(r => r.comment.id !== report.comment.id));
                setTotalReports(prev => prev - 1);
                await fetchReports();
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const shouldShowPagination = totalReports > 0 && totalPages > 1 && reports.length > 0;
    return (
        <div>
            <h1>{t("reports.title.comments")}</h1>
            <table>
                <thead>
                    <tr>
                        <th>{t("reports.reporter")}</th>
                        <th>{t("reports.reason")}</th>
                        <th>{t("reports.comments")}</th>
                        <th>{t("admin.actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.map((report) => (
                        <tr key={report.id}>
                            <td>
                                {report.user.username}
                            </td>
                            <td>
                                {report.reason}
                                {/* <button><Link to={`${report.id}`}>{report.title}</Link></button> */}
                                {/* <button onClick={() => showReportDetail(report.id)}>{report.title}</button> */}
                            </td>
                            <td>
                                {report.comment.text}
                            </td>
                            <td>
                                <button onClick={() => handleDiscard(report.id)}>{t("discard")}</button>
                                <button onClick={() => handleDelete(report)}>{t("delete")}</button>
                                <button onClick={() => handleBan(report.comment.userId)}>{t("admin.ban")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {shouldShowPagination && (
                <div>
                    <h4>{t("reports.title")}: ({totalReports})</h4>

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

        </div >
    )
}