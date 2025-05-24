import React, { useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/components/request-detail/RequestDetail.css'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next'
import { showReportPopup } from '../popups/ReportPopup.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler.js';
import { motion } from 'framer-motion'
import { Loading } from '../../components/Loading.jsx';

let showRequestDetail;

export const RequestDetail = () => {
  const [request, setRequest] = useState(null)
  const [visible, setVisible] = useState(false);
  const [flip, setFlip] = useState(true);
  const navigate = useNavigate()
  const { user } = useAuth();
  const { t } = useTranslation();

  showRequestDetail = async (requestId) => {

    try {
      const url = `${API_URL}/requests/${requestId}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        setRequest(null);
        return;

      }
      const data = await response.json()
      setRequest(data)
      setVisible(true);
      setFlip(true);
    } catch (error) {
      toast.error(t(errorHandler(error)))
      setRequest(null);
    }
  }

  const handleReport = (type, postId) => {
    if (!user) {
      navigate('/login')
      return
    }
    showReportPopup(type, postId)
  }

  const closePopup = () => {
    setVisible(false);
    setFlip(true);
  }

  if (!visible) return null;

  return createPortal(
    <div className="popup-overlay" onClick={closePopup}>
      {request && (
        <motion.div
          className="popup-content"
          onClick={(e) => e.stopPropagation()}

          transition={{ duration: 0.7 }}
          animate={{ rotateY: flip ? 0 : 180 }}
        >
          <motion.div
            transition={{ duration: 0.7 }}
            animate={{ rotateY: flip ? 0 : 180 }}
            onClick={() => setFlip((prevState) => !prevState)}
            className="front flex flex-col items-start justify-start relative h-full"
          >
            {user && user.role === 'fan' && (
              <div className="absolute top-2 right-3 z-30">
                <button className="relative bg-white border-2 border-black transform -skew-x-6 -rotate-6 px-2 py-1" onClick={(e) => {
                  e.stopPropagation()
                  handleReport("request", request.id)
                }}>
                  <img src={'/assets/images/icons/report.png'} alt="Report comment" className="max-h-4" />
                </button>
              </div>
            )}
            <h1 className="text-6xl text-left text-border mb-4 break-words max-w-full text-[4rem] sm:text-[5rem]">{request.target}</h1>
            <div className="flex-grow flex items-center justify-center h-full absolute inset-0">
              <p className="text-5xl filled-text text-stroke-2 text-stroke-black px-2 text-center break-words max-w-full">{request.description}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flip ? 180 : 0 }}
            transition={{ duration: 0.7 }}
            onClick={() => setFlip((prevState) => !prevState)}
            className={`${request.targetImage ? 'back' : 'back-unknown'}`}
          >
            {request.targetImage &&
              <div className="relative w-[25vmax] h-[25vmax] md:w-[20vmax] md:h-[20vmax] border-12 border-black outline-10 outline-white -skew-x-2">
                <img
                  src={request.targetImage}
                  alt={request.target}
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <img
                  src="/assets/images/icons/sword.png"
                  alt="Sword"
                  className="absolute  top-[-4vmax] right-[22.5vmax] h-[8vw] sm:top-[-5vmax] sm:right-[22.5vmax] sm:h-[6vw] md:top-[-3vmax] md:right-[18.5vmax] md:h-[3vw] scale-x-[-1] z-10"
                />
              </div>}
          </motion.div>
        </motion.div>
      )}
    </div>,
    document.body
  );
};

export { showRequestDetail };
export default RequestDetail;