import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { showRequestDetail } from './RequestDetail.jsx'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';

export const RequestList = () => {
    const [requests, setRequests] = useState([])
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { user } = useAuth()
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_URL}/requests`, {
                    method: 'GET',
                    credentials: 'include'
                })

                const data = await response.json()
                if (response.ok) {
                    setRequests(data)
                } else {
                    setError(errorHandler(data));
                }
            } catch (error) {
                setError(errorHandler(error));
            }
        }
        fetchRequests()
    }, [navigate])

    const handleVote = async (vote, request) => {
        if (!user) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/requests/${request.id}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vote }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                //await getPollResults(poll.id)
                setError(null);
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    };

    return (
        // TODO Refactor para aprovechar para: vista phantom thief, lista general, lista usuarios
        <div>
            <h1>{t("requests.new")}</h1>
            {error && t(error)}
            <Link to="/newrequest">{t("requests.create")}</Link>
            <h1>{t("requests.title")}</h1>
            <table>
                <thead>
                    <tr>
                        {/* <th>{t("requests.status")}</th> */}
                        <th>{t("title")}</th>
                        <th>{t("requests.target")}</th>
                        <th>votos</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => (
                        <tr key={request.id}>
                            {/* <td>
                                {request.status}
                            </td> */}
                            <td>
                                <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
                            </td>
                            <td>
                                {request.target}
                            </td>
                            <td>
                                <button onClick={() => handleVote(true, this)}>↑</button>
                                <span>0</span>
                                <button onClick={() => handleVote(false, this)}>↓</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}