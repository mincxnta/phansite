import React, { useEffect, useState, useRef } from 'react'
import { API_URL, SOCKET_URL } from '../../constants/constants'
import { Link, useNavigate } from 'react-router-dom'
import { CommentSection } from './CommentSection.jsx'
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../../utils/errorHandler.js';
import { toast } from 'react-toastify';
import { Loading } from '../../components/Loading.jsx';
import { io } from 'socket.io-client';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import '../../assets/styles/Hover.css'

const Counter = ({ from, to, duration }) => {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, to, { duration: duration });
    return () => controls.stop();
  }, [to]);

  return <motion.span>{rounded}</motion.span>;
};

export const Poll = () => {
  const navigate = useNavigate()
  const [poll, setPoll] = useState('')
  const [yesPercentage, setYesPercentage] = useState(0);
  const [previousPercentage, setPreviousPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const { i18n, t } = useTranslation();
  const commentsRef = useRef(null);
  const [userVote, setUserVote] = useState();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      withCredentials: false,
    });

    newSocket.on('pollVoted', (data) => {
      if (data.pollId == poll.id) {
        getPollResults(data.pollId);
        getUserVote()
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [poll.id]);

  const getUserVote = async () => {
    if (poll && user && user.role === 'fan') {
      try {
        const response = await fetch(`${API_URL}/polls/${poll.id}/user-vote`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (response.ok) {
          setUserVote(data.vote);
        }
        return { pollId: poll.id, vote: null };
      } catch (error) {
        toast.error(t(errorHandler(error)));
        return { pollId: poll.id, vote: null };
      }

    }
  }

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
          await getUserVote()
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

  useEffect(() => {
    if (poll && user && user.role === 'fan') {
      getUserVote();
    }
  }, [poll, user]);

  const getPollResults = async (pollId) => {
    try {
      const response = await fetch(`${API_URL}/polls/${pollId}/results`, {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();
      if (response.ok) {
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
        setUserVote(vote);
      } else {
        toast.error(t(errorHandler(data)))
      }
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  };

  const showComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useEffect(() => {
    return () => {
      setPreviousPercentage(parseFloat(yesPercentage));
    };
  }, [yesPercentage]);

  useEffect(() => {
    setPreviousPercentage(0);
    setYesPercentage(0);
  }, [poll]);

  if (isLoading) {
    return <Loading />;
  }

  const displayedQuestion = i18n.language === 'es' ? poll.questionEs : poll.questionEn;

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="w-full flex h-screen flex-col items-center justify-center">
        <h1 className="text-3xl mb-4 pt-20 text-[4rem] sm:text-[5rem] main">
          {t('home.poll')}
        </h1>
        <div className='flex flex-col items-center sm:flex-row'>
          <div className='flex items-center grow-1'>
            <Link to="/polls">
              <img
                src="/assets/images/icons/previous.png"
                title={t('polls.previous')}
                alt={t('polls.previous')}
                className="h-10 transition-transform hover:scale-110"
              />
            </Link>
            <h2 className='text-7xl ml-3 mr-2 text-persona-dark-red text-stroke'>Q</h2>
          </div>
          <h2 className="text-3xl grow-1">
            {displayedQuestion}
          </h2>
        </div>
        <div className="mb-6 w-[80%] sm:w-1/2 lg:w-2/4 xl:w-1/4">
          <div className="gradient">
            <span className="text-5xl font-medium uppercase">{t('yes')}</span>
            <span className="text-8xl font-bold">
              <Counter from={previousPercentage} to={parseFloat(yesPercentage)} duration={1} />%
            </span>
          </div>
          <div className="w-full h-12 bg-transparent-black border-6 border-black outline-white outline-6 -skew-x-15">
            <motion.div
              className="h-full bg-red-600 skew-x-3"
              initial={{ width: '0%' }}
              animate={{ width: `${yesPercentage}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />
          </div>
          <div className="flex w-full justify-between mt-[1em]">
            <span className="px-6 py-2 text-white uppercase text-4xl">
              {t('yes')}
            </span>
            <span className="px-6 py-2 text-white uppercase text-4xl">
              {t('no')}
            </span>
          </div>
        </div>
        <div className="flex justify-center gap-8">
          <button
            onClick={() => handleVote(true)}
            disabled={user && user?.role !== 'fan'}
            className={`form-input-container form-input-3 px-4 py-2 text-4xl ${userVote === true ? "voted" : ""} ${(!user || user.role !== 'fan' ? "disabled" : "")} ${(userVote !== null) ? "" : "button-hover"}`}
          >
            {t('yes')}
          </button>
          <button
            onClick={() => handleVote(false)}
            disabled={user && user?.role !== 'fan'}
            className={`form-input-container form-input-3 px-4 py-2 text-4xl ${userVote === false ? "voted" : ""} ${(!user || user.role !== 'fan' ? "disabled" : "")} ${(userVote !== null) ? "" : "button-hover"}`}
          >
            {t('no')}
          </button>
        </div>
        <img
          className="mt-24 w-14 button-hover arrow"
          src="/assets/images/icons/down.png"
          onClick={() => showComments()}
        />
      </div>
      {poll.id && (
        <CommentSection pollId={poll.id} ref={commentsRef} />
      )}
    </div>
  )
}