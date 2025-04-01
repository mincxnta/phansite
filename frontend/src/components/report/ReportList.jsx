import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useTranslation } from 'react-i18next'
import { ReportedComments } from './ReportedComments.jsx'
import { ReportedRequests } from './ReportedRequests.jsx'

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
            <ReportedComments />
            <ReportedRequests />
        </div>
    )
}