import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { showRequestDetail } from './RequestDetail.jsx'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { showReportPopup } from '../popups/ReportPopup.jsx'
import { showRequestPopup } from '../popups/RequestPopup.jsx'
import { toast } from 'react-toastify';

export const RequestList = () => {
    const [requests, setRequests] = useState([])
    const [results, setResults] = useState({})
    const navigate = useNavigate()
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useAuth()
    const [userVotes, setUserVotes] = useState({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRequests, setTotalRequests] = useState(0);
    const limit = 5;


    const getUserVotes = async () => {
        try {
            const response = await fetch(`${API_URL}/requests/user-votes`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                const votesMap = data.reduce((votes, vote) => {
                    votes[vote.requestId] = vote.vote;
                    return votes;
                }, {});
                setUserVotes(votesMap);
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    };

    const getAllRequestResults = async () => {
        try {
            const response = await fetch(`${API_URL}/requests/votes`,
                { method: 'GET' });
            const data = await response.json();
            if (response.ok) {
                const results = data.reduce((results, vote) => {
                    results[vote.requestId] = vote;
                    return results;
                }, {});
                setResults(results);
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) { 
            toast.error(t(errorHandler(error))) 
        }
    };

    const handleReport = (type, postId) => {
        showReportPopup(type, postId)
    }

    const fetchRequests = async () => {
        let url = `${API_URL}/requests/pending?page=${page}&limit=${limit}`;
        if (user) {
            if (user.role === 'phantom_thief') {
                if (location.pathname === '/thieves') {
                    url = `${API_URL}/requests?page=${page}&limit=${limit}`;
                }
            } else if (user.role === 'fan') {
                if (location.pathname === '/profile') {
                    url = `${API_URL}/requests/user?page=${page}&limit=${limit}`;
                }
            }
        }

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            })

            const data = await response.json()
            if (response.ok) {
                setRequests(data.requests)
                setTotalPages(data.totalPages);
                setTotalRequests(data.totalRequests);
                await getAllRequestResults();
                if (user) await getUserVotes();
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    }

    useEffect(() => {
        fetchRequests()
        getAllRequestResults();
    }, [navigate, page])

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
                getAllRequestResults();
            } else {
                toast.error(t(errorHandler(data)))
            }
        } catch (error) {
            toast.error(t(errorHandler(error)))
        }
    };

    const handleStatusChange = async (id, status) => {
        showRequestPopup(id, status, (updatedRequest) => {
            setRequests((prevRequests) => prevRequests.map((request) => request.id === id ? { ...request, ...updatedRequest } : request));
        })
        await fetchRequests();
    }

    return (
        <div>
            {user && user.role === 'fan' && location.pathname === '/requests' &&
                <>
                    <h1>{t("requests.new")}</h1>
                    <Link to="/newrequest">{t("requests.create")}</Link>
                </>}
            <h1>{t("requests.title")}</h1>
            {requests.length === 0 ? (
                <p>{t('requests.no.requests')}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            {user && user.role !== 'fan' && <th>{t('requests.status')}</th>}
                            <th>{t("title")}</th>
                            <th>{t("requests.target")}</th>
                            <th>{t("requests.votes")}</th>
                            {user && user.role === 'phantom_thief' && location.pathname === '/thieves' && <th>{t('comments.title')}</th>}
                            {user && user.role === 'phantom_thief' && location.pathname === '/thieves' && <th>{t('admin.actions')}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request) => {
                            const result = results[request.id] || { totalVotes: 0 };
                            const userVote = userVotes[request.id];
                            const showActionButtons = user && user.role === 'phantom_thief' && location.pathname === '/thieves';
                            const showVoteButtons = user && user.role === 'fan' && location.pathname === '/requests';

                            return (
                                <tr key={request.id}>
                                    {user && user.role !== 'fan' && (
                                        <td>{request.status}</td>
                                    )}
                                    <td>
                                        <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
                                    </td>
                                    <td>
                                        {request.target}
                                    </td>
                                    <td>
                                        {showVoteButtons && <button style={{ backgroundColor: userVote === true ? "white" : "transparent", color: userVote === true ? "black" : "white" }} disabled={!user || user?.role !== 'fan'} onClick={() => handleVote(true, request)}>↑</button>}
                                        <span>{result.totalVotes}</span>
                                        {showVoteButtons && <button style={{ backgroundColor: userVote === false ? "white" : "transparent", color: userVote === false ? "black" : "white" }} disabled={!user || user?.role !== 'fan'} onClick={() => handleVote(false, request)}>↓</button>}
                                    </td>
                                    {showActionButtons && (
                                        <td>{request.thiefComment || 'Sense comentari'}</td>
                                    )}
                                    {showActionButtons && (
                                        <td>
                                            <button disabled={request.status !== 'pending'} onClick={() => handleStatusChange(request.id, "rejected")}>{t("requests.rejected")}</button>
                                            <button disabled={request.status !== 'pending'} onClick={() => handleStatusChange(request.id, "completed")}>{t("requests.completed")}</button>
                                            <button disabled={request.status !== 'pending'} onClick={() => handleReport("request", request.id)}>{t("requests.report")}</button>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            {totalPages > 1 && (
                <div>
                    <h4>{t("requests.title")}: ({totalRequests})</h4>

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