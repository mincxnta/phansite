import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { API_URL } from '../../constants/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { showRequestDetail } from './RequestDetail.jsx'
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { showReportPopup } from '../popups/ReportPopup.jsx'
import { showRequestPopup } from '../popups/RequestPopup.jsx'
import { toast } from 'react-toastify';
import { showConfirmToast } from '../popups/ConfirmToast.jsx'
import { Table } from '../../components/Table.jsx'
import { SubmitButton } from '../../components/SubmitButton.jsx'

export const RequestList = () => {
  const [requests, setRequests] = useState([])
  const [results, setResults] = useState({})
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
      }
      else {
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
      }
      else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

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
        toast.success(t("success.vote.request"))
        await fetchRequests()
        getAllRequestResults();
      } else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  const handleStatusChangeClick = (requestId, status) => {
    showConfirmToast(
      t('confirmToast.banMessage'),
      () => handleStatusChange(requestId, status),
      () => { }
    );
  };

  const handleStatusChange = async (id, status) => {
    showRequestPopup(id, status, (updatedRequest) => {
      setRequests((prevRequests) => prevRequests.map((request) => request.id === id ? { ...request, ...updatedRequest } : request));
    })
    await fetchRequests();
  }

  const headers = [
    ...(user && user.role !== 'fan' ? [t('requests.status')] : []),
    t('title'),
    t('requests.target'),
    t('requests.votes'),
    ...(user && user.role === 'phantom_thief' && location.pathname === '/thieves'
      ? [t('comments.title'), t('admin.actions')]
      : []),
  ];

  const rows = requests.map((request) => {
    const result = results[request.id] || { totalVotes: 0 };
    const userVote = userVotes[request.id];
    const showActionButtons =
      user && user.role === 'phantom_thief' && location.pathname === '/thieves';
    const showVoteButtons =
      user && user.role === 'fan' && location.pathname === '/requests';

    const row = [];

    if (user && user.role !== 'fan') {
      row.push(request.status);
    }

    row.push(
      <button onClick={() => showRequestDetail(request.id)}>{request.title}</button>
    );

    row.push(request.target);

    row.push(
      <div>
        {showVoteButtons && (
          <button
            title={t('requests.upvote')}
            style={{
              backgroundColor: userVote === true ? 'white' : 'transparent',
              color: userVote === true ? 'black' : 'white',
            }}
            disabled={!user || user?.role !== 'fan'}
            onClick={() => handleVote(true, request)}
          >
            ↑
          </button>
        )}
        <span>{result.totalVotes}</span>
        {showVoteButtons && (
          <button
            title={t('requests.downvote')}
            style={{
              backgroundColor: userVote === false ? 'white' : 'transparent',
              color: userVote === false ? 'black' : 'white',
            }}
            disabled={!user || user?.role !== 'fan'}
            onClick={() => handleVote(false, request)}
          >
            ↓
          </button>
        )}
      </div>
    );

    if (showActionButtons) {
      row.push(request.thiefComment || t('requests.no.comment'));
      row.push(
        <div>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.rejected')}
            onClick={() => handleStatusChangeClick(request.id, 'rejected')}
          >
            {t('requests.rejected')}
          </button>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.completed')}
            onClick={() => handleStatusChangeClick(request.id, 'completed')}
          >
            {t('requests.completed')}
          </button>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.report')}
            onClick={() => handleReport('request', request.id)}
          >
            {t('requests.report')}
          </button>
        </div>
      );
    }

    return row;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div class="flex items-center justify-between w-full max-w-[85%] mb-8">
        <h1 className="text-4xl md:text-5xl text-white item- mb-6">{t("requests.title")}</h1>
        {user && user.role === 'fan' && location.pathname === '/requests' && <SubmitButton to="/newrequest" text={t("requests.create")} />}
      </div>
      {requests.length === 0 ? (
        <p>{t('requests.no.requests')}</p>
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