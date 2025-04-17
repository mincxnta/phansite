import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants'
import { useNavigate } from 'react-router-dom'
import { CommentSection } from './CommentSection.jsx'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../Loading.jsx';
import { io } from 'socket.io-client';

export const Poll = () => {
  const navigate = useNavigate()
  const [poll, setPoll] = useState('')
  const [results, setResults] = useState({ yes: 0, no: 0, total: 0 });
  const [yesPercentage, setYesPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { t } = useTranslation();
  const [pollSocket, setPollSocket] = useState(null);

  useEffect(() => {
    // Connectem a Socket.IO sense credencials
    const socketUrl = API_URL || 'http://localhost:3000';
    const newSocket = io(socketUrl, {
        withCredentials: false, // No necessitem credencials per aquesta funcionalitat
    });

    setPollSocket(newSocket);

    // Escoltem l'esdeveniment pollVoted
    newSocket.on('pollVoted', (data) => {
        console.log('Rebut pollVoted:', data); // Per depurar
        console.log(data)
        console.log(poll.id)
        if (data.pollId == poll.id) {
          console.log("Igual")
            // Cridem getPollResults per obtenir els resultats actualitzats
            getPollResults(data.pollId);
        }
    });

    // Escoltem possibles errors de connexió
    newSocket.on('connect_error', (error) => {
        console.error('Error de connexió amb Socket.IO:', error);
        toast.error(t('error.socket_connection'));
    });

    // Escoltem quan es connecta amb èxit
    newSocket.on('connect', () => {
        console.log('Connectat a Socket.IO amb èxit');
    });

    // Desconnectem quan el component es desmunta
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
  }, [navigate, t])

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
        //await getPollResults(poll.id)
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

  return (
    <div>
      <h1>
        {poll.question}
      </h1>
      <div>
        <progress value={yesPercentage} max="100" /> <span>{yesPercentage}%</span>
      </div>
      <button onClick={() => handleVote(false)} disabled={!user || user?.role !== 'fan'}>{t("no")}</button>
      <button onClick={() => handleVote(true)} disabled={!user || user?.role !== 'fan'}>{t("yes")}</button>
      <p>{t("poll.total.votes")}: {results.total}</p>
      {poll.id && <CommentSection pollId={poll.id} />}
    </div>
  )
}