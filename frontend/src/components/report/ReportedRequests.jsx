import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { showRequestDetail } from '../request/RequestDetail.jsx'

export const ReportedRequests = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${API_URL}/reports/request`, {
                    method: 'GET',
                    credentials: 'include'
                })

                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setReports(data)
                }
            } catch (error) {
                console.log(error.message)
                navigate('/')

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

            if (response.ok) {
                await response.json()
            } else {
                console.log('Error')
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
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
                                <button>Descartar</button>
                                <button>Eliminar</button>
                                <button onClick={() => handleBan(report.request.userId)}>Banear</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}