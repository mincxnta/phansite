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
import { Pagination } from '../../components/Pagination.jsx'

export const RequestList = ({ profile }) => {
  const [requests, setRequests] = useState([])
  const [results, setResults] = useState({})
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth()
  const [userVotes, setUserVotes] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRequests, setTotalRequests] = useState(0);
  const [filterStatus, setFilterStatus] = useState('pending');
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
          url += filterStatus ? `&status=${filterStatus}` : '';
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
  }, [page, filterStatus])

  useEffect(() => {
    if (user) {
      getUserVotes();
    }
  }, [user]);

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
        setUserVotes((prev) => ({
          ...prev,
          [request.id]: vote,
        }));
        await fetchRequests()
      } else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  const handleStatusChangeClick = (requestId, status) => {
    showConfirmToast(status == "rejected" ? t('toast.request.reject') :
      t('toast.request.complete'),
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

  const hasPendingRequests = requests.some((request) => request.status === 'pending')

  const headers = [
    ...(location.pathname === '/profile' ? [t('requests.status.title')] : []),
    t('title'),
    t('requests.target'),
    t('requests.votes'),
    ...(user && user.role === 'phantom_thief' && location.pathname === '/thieves' ? [t('comments.title')] : []),
    ...(user && user.role === 'phantom_thief' && location.pathname === '/thieves' && hasPendingRequests
      ? [t('admin.actions')]
      : []),
  ];

  const rows = requests.map((request) => {
    const result = results[request.id] || { totalVotes: 0 };
    const userVote = userVotes[request.id];
    const showActionButtons =
      user && user.role === 'phantom_thief' && location.pathname === '/thieves' && request.status === 'pending';
    const showVoteButtons =
      user && user.role === 'fan' && location.pathname === '/requests';

    const row = [];

    if (location.pathname === '/profile') {
      row.push(t(`requests.status.${request.status}`));
    }

    row.push(
      <button className="w-full table-text" onClick={() => showRequestDetail(request.id)}>{request.title}</button>
    );

    row.push(request.target);

    row.push(
      <div className='flex items-center gap-2 justify-center'>
        {showVoteButtons && (
          <img
            src={userVote === true ? '/assets/images/icons/voted.png' : '/assets/images/icons/vote.png'}
            title={t('requests.upvote')}
            className='h-[2rem] button-hover'
            disabled={!user || user?.role !== 'fan'}
            onClick={() => handleVote(true, request)}
          />
        )}
        <span className="min-w-4">{result.totalVotes}</span>
        {showVoteButtons && (
          <img
            src={userVote === false ? '/assets/images/icons/voted.png' : '/assets/images/icons/vote.png'}
            title={t('requests.downvote')}
            className='scale-y-[-1] h-[2rem] button-hover'
            disabled={!user || user?.role !== 'fan'}
            onClick={() => handleVote(false, request)}
          />
        )}
      </div>
    );
    if (user && user.role === 'phantom_thief' && location.pathname === '/thieves') {
      row.push(request.thiefComment || t('requests.no.comment'));
    }

    if (showActionButtons) {
      row.push(
        <div>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.rejected')}
            onClick={() => handleStatusChangeClick(request.id, 'rejected')}
          >
            <img className="w-8 mr-2 button-hover" src="/assets/images/icons/reject.png" />
          </button>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.completed')}
            onClick={() => handleStatusChangeClick(request.id, 'completed')}
          >
            <img className="w-8 mr-2 button-hover" src="/assets/images/icons/complete.png" />
          </button>
          <button
            disabled={request.status !== 'pending'}
            title={t('requests.report')}
            onClick={() => handleReport('request', request.id)}
          >
            <img className="w-8 button-hover" src="/assets/images/icons/report-white.png" />
          </button>
        </div>
      );
    }

    return row;
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-[85%] mb-8 pt-20">
        <h1 className="text-4xl md:text-5xl text-white item- mb-6">
          {profile ? t("profile.requests") : t("requests.title")}
        </h1>
        {user && user.role === 'fan' && location.pathname === '/requests' && <SubmitButton to="/newrequest" text={t("requests.create")} />}
      </div>
      {user && user.role === 'phantom_thief' && (location.pathname === '/thieves' || location.pathname === '/requests') && (
        <div className="flex justify-start w-[90%]">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 text-lg text-center form-input-container form-input-1 mb-8"
          >
            <option value="pending">{t('requests.pending')}</option>
            <option value="rejected">{t('requests.rejected')}</option>
            <option value="completed">{t('requests.completed')}</option>
          </select>
        </div>
      )}
      {requests.length === 0 ? (
        <p className="min-h-[60vh]">{t('requests.no.requests')}</p>
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