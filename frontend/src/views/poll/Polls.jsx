import React, { useEffect, useState } from 'react';
import { API_URL } from '../../constants/constants';
import { useTranslation } from 'react-i18next';
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { Table } from '../../components/Table.jsx';
import { Pagination } from '../../components/Pagination.jsx';

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

  const headers = [
    t('polls.question'),
    t('polls.results'),
    t('polls.total.votes'),
    ...(user && user.role === 'fan' ? [t('polls.your.vote')] : []),
  ];

  const rows = polls.map((poll) => {
    const row = [
      i18n.language === 'es' ? poll.questionEs : poll.questionEn,
      `${poll.results.yesPercentage}%`,
      poll.results.total,
    ];
    if (user && user.role === 'fan') {
      row.push(
        userVotes[poll.id] === undefined || userVotes[poll.id] === null
          ? t('polls.no.vote')
          : userVotes[poll.id]
            ? t('yes')
            : t('no')
      );
    }
    return row;
  });

  useEffect(() => {
    fetchPolls();
  }, [t, user, page]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl md:text-5xl text-white item- mb-6">{t('polls.title')}</h1>
      {polls.length === 0 ? (
        <p className="text-white text-lg">{t('polls.no.polls')}</p>
      ) : (
        <>
          <Table headers={headers} rows={rows} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </div>
  );
};