import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { showReportDetail } from './ReportDetail.jsx'
import { useTranslation } from 'react-i18next'

export const ReportList = () => {
    const [reports, setReports] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${API_URL}/reports`, {
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

    return (
        <div>
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
                                {report.status}
                            </td>
                            <td>
                                {/* <button><Link to={`${report.id}`}>{report.title}</Link></button> */}
                                <button onClick={() => showReportDetail(report.id)}>{report.title}</button>
                            </td>
                            <td>
                                {report.target}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}