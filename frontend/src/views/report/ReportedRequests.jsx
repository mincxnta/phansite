import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { showRequestDetail } from '../request/RequestDetail.jsx'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { Table } from '../../components/Table.jsx'

export const ReportedRequests = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
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

    const handleBanClick = (userId) => {
        showConfirmToast(
            t('confirmToast.banMessage'),
            () => handleBan(userId),
            () => { }
        );
    };

    const handleDiscardClick = (reportId) => {
        showConfirmToast(
            t('confirmToast.banMessage'),
            () => handleDiscard(reportId),
            () => { }
        );
    };

    const handleDeleteClick = (report) => {
        showConfirmToast(
            t('confirmToast.banMessage'),
            () => handleDelete(report),
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
            }
            toast.success(t("success.user.banned"))
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
                toast.success(t("success.report.discard"))
                await response.json()
                setReports((prevReports) => prevReports.filter(report => report.id !== id));
                await fetchReports()
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
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
                toast.success(t("success.delete.request"))
                await fetchReports()
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    const headers = [
        t("reports.reporter"),
        t("reports.reason"),
        t("reports.requests"),
        t("admin.actions")
    ];

    // Definir les files de la taula
    const rows = reports.map((report) => [
        report.user.username,
        report.reason,
        <button onClick={() => showRequestDetail(report.request.id)}>
            {report.request.title}
        </button>,
        <div>
            <button title={t("discard")} onClick={() => handleDiscardClick(report.id)}>
                {t("discard")}
            </button>
            <button title={t("delete")} onClick={() => handleDeleteClick(report)}>
                {t("delete")}
            </button>
            <button title={t("admin.ban")} onClick={() => handleBanClick(report.request.userId)}>
                {t("admin.ban")}
            </button>
        </div>
    ]);

    return (
        <div>
            <h1>{t("reports.title.requests")}</h1>
            {reports.length === 0 ? (
                <p>{t('reports.no.reports')}</p>
            ) : (
                <Table headers={headers} rows={rows} />
            )}

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