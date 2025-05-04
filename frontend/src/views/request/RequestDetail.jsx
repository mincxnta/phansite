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

let showRequestDetail;

export const RequestDetail = () => {
  const [request, setRequest] = useState(null)
  const [visible, setVisible] = useState(false);
  const [flip, setFlip] = useState(true);
  const navigate = useNavigate()
  const { user } = useAuth();
  const { t } = useTranslation();

  showRequestDetail = async (requestId) => {
    setVisible(true);
    setFlip(true);
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
            className="front"
          >
            {user && user.role === 'fan' && (
              <button className="report-button" onClick={(e) => {
                e.stopPropagation()
                handleReport("request", request.id)}}>
                <img src={'/assets/images/icons/report.png'} alt="Report comment" style={{ maxHeight: '16px' }} />
              </button>
            )}
            <h1>{request.target}</h1>
            <p>{request.description}</p>
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flip ? 180 : 0 }}
            transition={{ duration: 0.7 }}
            onClick={() => setFlip((prevState) => !prevState)}
            className="back"
          >
            <img
              src={request.targetImage || '/assets/requests/unknownTarget.png'}
              alt={request.target}
              style={{ width: '200px', transform: 'scaleX(-1)' }}
            />
          </motion.div>
        </motion.div>
      )}
    </div>,
    document.body
  );
};

export { showRequestDetail };
export default RequestDetail;