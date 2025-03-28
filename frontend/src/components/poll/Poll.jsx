import React from 'react'
import { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants'
import { useNavigate } from 'react-router-dom'
import { Comments } from './Comments'

export const Poll = () => {
    const navigate = useNavigate()
    const [poll, setPoll] = useState('')
    const [results, setResults] = useState({ yes: 0, no: 0, total: 0 });
    const [error, setError] = useState(null);
    const [yesPercentage, setYesPercentage] = useState(0);

    useEffect(() => {
        const getActivePoll = async () => {
            try {
                const response = await fetch(`${API_URL}/polls/active`, {
                    method: 'GET',
                    credentials: 'include'
                })

                console.log(response)
                if (response.ok) {
                    const data = await response.json()
                    setPoll(data)
                    await getPollResults(data.id)
                }
            } catch (error) {
                console.log(error.message)
                navigate('/')

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
    
          if (response.ok) {
            const data = await response.json();
            setResults(data);
            const percentage = data.total > 0 ? (data.yes / data.total) * 100 : 0;
            setYesPercentage(percentage.toFixed(1));
          } else {
            console.log('Error al obtenir els resultats');
          }
        } catch (error) {
          console.log('Error de xarxa:', error);
        }
      };
      
    const handleVote = async (vote) => {
        try {
          const response = await fetch(`${API_URL}/polls/${poll.id}/vote`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vote }),
            credentials: 'include',
          });
    
          if (response.ok) {
            await getPollResults(poll.id)
            setError(null);
          } else {
            const errorData = await response.json();
            setError(errorData.message);
          }
        } catch (error) {
          console.log(error);
          setError('Error al votar');
        }
      };

    return (
        <div>
            {error && error}
            <h1>
                {poll.question}
            </h1>
            <div>
                <progress value={yesPercentage} max="100"/> <span>{yesPercentage}%</span>
            </div>
            <button onClick={() =>handleVote(false)}>No</button>
            <button onClick={() =>handleVote(true)}>Yes</button>
            <p>Total votes: {results.total}</p>

            <Comments pollId={poll.id}/>
        </div>
    )
}