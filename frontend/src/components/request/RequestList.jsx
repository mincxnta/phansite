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
    const [userVotes, setUserVotes] = useState({});
    const [error, setError] = useState(null);

    const getUserVotes = async () => {
        try {
            const response = await fetch(`${API_URL}/requests/user-votes`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            console.log('User Votes:', data);
            if (response.ok) {
                // Transformem l'array de vots en un objecte per accedir-hi ràpidament per requestId
                const votesMap = data.reduce((votes, vote) => {
                    votes[vote.requestId] = vote.vote; // Només guardem el vote (true o false)
                    return votes;
                }, {});
                setUserVotes(votesMap);
                setError(null);
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    };


    const fetchRequests = async () => {
        // let url = `${API_URL}/requests`;
        // if (user) {
        //     if (user.role === 'phantomThief') {
        //         url = `${API_URL}/requests/all`;
        //     } else if (user.role === 'fan') {
        //         url = `${API_URL}/requests/my`;
        //     }
        // }

        try {
            const response = await fetch(`${API_URL}/requests`, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()
            if (response.ok) {
                setRequests(data)
                if (user) await getUserVotes();
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    }
    useEffect(() => {
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
                await fetchRequests()
                setError(null);
            } else {
                setError(errorHandler(data));
            }
        } catch (error) {
            setError(errorHandler(error));
        }
    };

    return (
        <div>
            <h1>{t("requests.new")}</h1>
            {error && t(error)}
            <Link to="/newrequest">{t("requests.create")}</Link>
            <h1>{t("requests.title")}</h1>
            <table>
                <thead>
                    <tr>
                        {/*{user && user.role !== 'fan' && <th>{t('requests.status')}</th>} */}
                        <th>{t("title")}</th>
                        <th>{t("requests.target")}</th>
                        <th>votos</th>
                        {/* {user && user.role === 'phantomThief' && <th>{t('actions')}</th>} */}
                    </tr>
                </thead>
                <tbody>
                    {requests.map((request) => {
                        const userVote = userVotes[request.id];
                        return (
                            <tr key={request.id}>
                                {/* {user && user.role !== 'fan' && (
                                    <td>{request.status}</td>
                                )} */}
                                <td>
                                    <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
                                </td>
                                <td>
                                    {request.target}
                                </td>
                                {/* {user && user.role !== 'admin' && (
                                    <td>{request.comment || 'Sense comentari'}</td>
                                )} */}
                                <td>
                                    <button style={{ backgroundColor: userVote ? "white" : "", color: userVote ? "black" : "" }} disabled={!user} onClick={() => handleVote(true, request)}>↑</button>
                                    <span>{request.totalVotes}</span>
                                    <button style={{ backgroundColor: userVote ? "" : "white", color: userVote ? "" : "black" }} disabled={!user} onClick={() => handleVote(false, request)}>↓</button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}