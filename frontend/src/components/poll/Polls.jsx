import React, { useEffect, useState } from 'react'
import { API_URL, SOCKET_URL } from '../../constants/constants'
import { useNavigate } from 'react-router-dom'
import { CommentSection } from './CommentSection.jsx'
//import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../Loading.jsx';

export const Polls = () => {
  const navigate = useNavigate()
  const [polls, setPolls] = useState([])
  // const [results, setResults] = useState({ yes: 0, no: 0, total: 0 });
  // const [yesPercentage, setYesPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  //const { user } = useAuth()
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const getPolls = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_URL}/polls`, {
          method: 'GET'
        })

        const data = await response.json()
        if (response.ok) {
          setPolls(data)
          // await getPollsResults(data.id)
        } else {
          toast.error(t(errorHandler(data)))
        }
      } catch (error) {
        toast.error(t(errorHandler(error)))
      } finally {
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 1000);
      }
    }
    getPolls()
  }, [])
  

  //Hacerlo para cada poll
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

  return (
    <div>
      <h1>{t("home.poll")}</h1>
      <table>
        <thead>
          <tr>
          <th>Encuesta</th>
          <th>Resultados</th>
          <th>Votos totales</th>
          <th>Tu voto</th>
          </tr>
        </thead>
        <tbody>
        {polls.map((poll) => {
          return (
            <tr key={poll.id}>
              <td>{i18n.language === 'es' ? poll.questionEs : poll.questionEn}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  )
}