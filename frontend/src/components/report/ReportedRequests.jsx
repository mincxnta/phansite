import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { showRequestDetail } from '../request/RequestDetail.jsx'
import { errorHandler } from '../../utils/errorHandler.js';
import { showPopUp } from '../PopUp.jsx'

export const ReportedRequests = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${API_URL}/reports/request`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()
                if (response.ok) {
                    setReports(data)
                } else {
                    setError(errorHandler(data));
                }
            } catch (error) {
                setError(errorHandler(error));

            }
        }
        fetchReports()
    }, [navigate])

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
                await response.json()
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }

    return (
        <div>
            {error && t(error)}
            <h1>Peticiones reportadas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Reporter</th>
                        <th>Razon</th>
                        <th>Comentario</th>
                        <th>Acciones</th>
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
                                <button onClick={() => handleDiscard(report.id)}>Descartar</button>
                                <button onClick={() => handleDelete(report)}>Eliminar</button>
                                <button onClick={() => handleBan(report.request.userId)}>Banear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}