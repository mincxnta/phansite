import React, { useEffect, useState } from 'react'
import { API_URL, SOCKET_URL } from '../../constants/constants'
import { Link, useNavigate } from 'react-router-dom'
import { CommentSection } from './CommentSection.jsx'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../layout/Loading.jsx';
import { io } from 'socket.io-client';

export const Poll = () => {
  const navigate = useNavigate()
  const [poll, setPoll] = useState('')
  const [results, setResults] = useState({ yes: 0, no: 0, total: 0 });
  const [yesPercentage, setYesPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { i18n, t } = useTranslation();
  const [pollSocket, setPollSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
        withCredentials: false,
    });

    setPollSocket(newSocket);

    newSocket.on('pollVoted', (data) => {
        if (data.pollId == poll.id) {
            getPollResults(data.pollId);
        }
    });

    return () => {
        newSocket.disconnect();
    };
}, [poll.id]);

  useEffect(() => {
    const getActivePoll = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/polls/active`, {
          method: 'GET',
          credentials: 'include'
        })

        const data = await response.json()
        if (response.ok) {
          setPoll(data)
          await getPollResults(data.id)
        } else {
          toast.error(t(errorHandler(data)))
        }
      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    }
    getActivePoll()
  }, [navigate])

  const getPollResults = async (pollId) => {
    try {
      const response = await fetch(`${API_URL}/polls/${pollId}/results`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
        setResults(data);
        const percentage = data.total > 0 ? (data.yes / data.total) * 100 : 0;
        setYesPercentage(percentage.toFixed(1));
      } else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  const handleVote = async (vote) => {
    if (!user) {
      navigate('/login')
      return;
    }

    try {
      const response = await fetch(`${API_URL}/polls/${poll.id}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(t("success.vote.poll"))
      } else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  if (isLoading) {
          return <Loading/>;
      }

      const displayedQuestion = i18n.language === 'es' ? poll.questionEs : poll.questionEn;

  return (
    <div>
      <h1>{t("home.poll")}</h1>
      <h1>
        {displayedQuestion}
      </h1>
      <div>
        <progress value={yesPercentage} max="100" /> <span>{yesPercentage}%</span>
      </div>
      <button onClick={() => handleVote(false)} disabled={user && user?.role !== 'fan'}>{t("no")}</button>
      <button onClick={() => handleVote(true)} disabled={user && user?.role !== 'fan'}>{t("yes")}</button>
      <p>{t("poll.total.votes")}: {results.total}</p>
      <Link to="/polls">{t("polls.previous")}</Link>
      {poll.id && <CommentSection pollId={poll.id} />}
    </div>
  )
}