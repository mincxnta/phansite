import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const ReportedComments = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${API_URL}/reports/comment`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()
                if (response.ok) {   
                    setReports(data)
                }else{
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
            {error && t(error)}
            <h1>Publicaciones reportadas</h1>
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
                                {report.comment.text}
                            </td>
                            <td>
                                <button>Descartar</button>
                                <button>Eliminar</button>
                                <button onClick={() => handleBan(report.comment.userId)}>Banear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}