import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/requests/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.jsx';

let showReportForm;

export const ReportForm = () => {
  const [reason, setReason] = useState(null)
  const [visible, setVisible] = useState(false);
  const [reportedType, setReportedType] = useState(null);
  const [postId, setPostId] = useState(null);
  const { user } = useAuth()

  useEffect(()=>{
    if (!user){
      return
    }
  })

  showReportForm = async (type, postId) => {
    setReportedType(type);
    setVisible(true);
    setPostId(postId);
  }

  const handleNewReport = async (event) => {
    event.preventDefault()
    

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason, reportedType, postId })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message)
      }
      await response.json()
      setReason(null);
      closePopup();
    } catch (error) {
      console.log(error);
    }
  }

  const closePopup = () => {
    setVisible(false);
  }

  if (!visible) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={closePopup}>Tancar</button>
        <form onSubmit={handleNewReport}>
          <h4>What's wrong with this post?</h4>
          <textarea name="" id="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>,
    document.body
  );
};

export { showReportForm };
export default ReportForm;