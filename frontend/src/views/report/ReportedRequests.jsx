import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { showRequestDetail } from '../request/RequestDetail.jsx'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { Table } from '../../components/Table.jsx'
import { Pagination } from '../../components/Pagination.jsx'

export const ReportedRequests = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 9;

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_URL}/reports?type=request&page=${page}&limit=${limit}`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await response.json()
            if (response.ok) {
                setReports(data.reports);
                setTotalPages(data.totalPages);
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
            t('toast.ban'),
            () => handleBan(userId),
            () => { }
        );
    };

    const handleDiscardClick = (reportId) => {
        showConfirmToast(
            t('toast.report.discard'),
            () => handleDiscard(reportId),
            () => { }
        );
    };

    const handleDeleteClick = (report) => {
        showConfirmToast(
            t('toast.report.request'),
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
        t('reports.author'),
        t("reports.requests"),
        t("admin.actions")
    ];

    const rows = reports.map((report) => [
        report.user.username,
        report.reason,
        report.request.user?.username,
        <button className="w-full table-text" onClick={() => showRequestDetail(report.request.id)}>
            {report.request.title}
        </button>,
        <div className='flex'>
            <button title={t("discard")} onClick={() => handleDiscardClick(report.id)}>
            <img className="w-8 mr-2 button-hover" src="/assets/images/icons/discard.png"/>
            </button>
            <button title={t("delete")} onClick={() => handleDeleteClick(report)}>
            <img className="w-8 mr-2 button-hover" src="/assets/images/icons/delete-white.png"/>
            </button>
            <button title={t("admin.ban")} onClick={() => handleBanClick(report.request.userId)}>
            <img className="w-8 button-hover" src="/assets/images/icons/ban.png"/>
            </button>
        </div>
    ]);

    return (
        <div className="flex flex-col items-center w-full max-w-[95%] sm:max-w-[85%] mb-8">
            <h1 className="mb-4 text-[4rem] sm:text-[5rem]">{t("reports.title.requests")}</h1>
            {reports.length === 0 ? (
                <p>{t('reports.no.reports')}</p>
            ) : (
                <Table headers={headers} rows={rows} />
            )}

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