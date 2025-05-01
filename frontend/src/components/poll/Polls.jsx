import React, { useEffect, useState } from 'react';
import { API_URL, SOCKET_URL } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../Loading.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const Polls = () => {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { i18n, t } = useTranslation();
  const [userVotes, setUserVotes] = useState({});
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPolls, setTotalPolls] = useState(0);
  const limit = 5;

  const fetchPolls = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/polls?page=${page}&limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setPolls(data.polls);
        setTotalPages(data.totalPages);
        setTotalPolls(data.totalPolls);

        if (user && user.role === 'fan' && data.polls.length > 0) {
          const votes = await Promise.all(
            data.polls.map(async (poll) => {
              try {
                const voteResponse = await fetch(`${API_URL}/polls/${poll.id}/user-vote`, {
                  method: 'GET',
                  credentials: 'include',
                });
                const voteData = await voteResponse.json();
                if (voteResponse.ok) {
                  return { pollId: poll.id, vote: voteData.vote };
                }
                return { pollId: poll.id, vote: null };
              } catch (error) {
                toast.error(t(errorHandler(error)));
                return { pollId: poll.id, vote: null };
              }
            })
          );
          const votesMap = votes.reduce((acc, { pollId, vote }) => {
            acc[pollId] = vote;
            return acc;
          }, {});
          setUserVotes(votesMap);
        }
      } else {
        toast.error(t(errorHandler(data)));
      }
    } catch (error) {
      toast.error(t(errorHandler(error)));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [t, user, page]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>{t('polls.title')}</h1>
      {polls.length === 0 ? (
        <p>{t('polls.no_polls')}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>{t('polls.question')}</th>
                <th>{t('polls.results')}</th>
                <th>{t('polls.total.votes')}</th>
                {user && user.role === 'fan' && <th>{t('polls.your.vote')}</th>}
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id}>
                  <td>{i18n.language === 'es' ? poll.questionEs : poll.questionEn}</td>
                  <td>
                    {poll.results.yesPercentage}%
                  </td>
                  <td>{poll.results.total}</td>
                  {user && user.role === 'fan' && (
                    <td>
                      {userVotes[poll.id] === undefined || userVotes[poll.id] === null
                        ? t('polls.no.vote')
                        : userVotes[poll.id]
                        ? t('yes')
                        : t('no')}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
              >
                {t('previous')}
              </button>
              <span>{t('pagination', { page, totalPages })}</span>
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
              >
                {t('next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};