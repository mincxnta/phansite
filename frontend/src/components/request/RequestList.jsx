import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { showRequestDetail } from './RequestDetail.jsx'
import { useTranslation } from 'react-i18next'

export const RequestList = () => {
    const [requests, setRequests] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/requests`, {
                    method: 'GET',
                    credentials: 'include'
                })

                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setRequests(data)
                }
            } catch (error) {
                console.log(error.message)
                navigate('/')
            }
        }
        fetchRequests()
    }, [navigate])

    return (
        <div>
            <h1>{t("requests.new")}</h1>
            <Link to="/newrequest">{t("requests.create")}</Link>
            <h1>{t("requests.title")}</h1>
            <table>
                <thead>
                    <tr>
                        <th>{t("requests.status")}</th>
                        <th>{t("title")}</th>
                        <th>{t("requests.target")}</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            <td>
                                {request.status}
                            </td>
                            <td>
                                <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
                            </td>
                            <td>
                                {request.target}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}