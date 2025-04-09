import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { showRequestDetail } from '../request/RequestDetail.jsx'
import { errorHandler } from '../../utils/errorHandler.js';
import { showPopUp } from '../popups/PopUp.jsx'

export const ReportedRequests = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalReports, setTotalReports] = useState(0);
    const limit = 5;

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/reports/type?type=request&page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include'
            })
            console.log("Response: ", response);
            const data = await response.json()
            if (response.ok) {
                setReports(data.reports);
                setTotalPages(data.totalPages);
                setTotalReports(data.totalReports);
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));

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
                setError(errorHandler(data));
            }
            showPopUp("Usuario baneado satisfactoriamente");
        } catch (error) {
            setError(errorHandler(error));
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
                await fetchReports()
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    const handleDelete = async (report) => {
        handleDiscard(report.id);
        try {
            const response = await fetch(`${API_URL}/requests/${report.request.id}`, {
                method: 'DELETE',
                credentials: 'include'
            })

            if (response.ok) {
                await fetchReports()

            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            {error && t(error)}
            <h1>{t("reports.title.requests")}</h1>
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
                                <button onClick={() => showRequestDetail(report.request.id)}>{report.request.title}</button>
                            </td>
                            <td>
                                <button onClick={() => handleDiscard(report.id)}>{t("discard")}</button>
                                <button onClick={() => handleDelete(report)}>{t("delete")}</button>
                                <button onClick={() => handleBan(report.request.userId)}>{t("admin.ban")}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {totalPages > 1 && (
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

        </div>
    )
}