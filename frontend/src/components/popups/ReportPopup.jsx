import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/requests/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
// import { showPopUp } from './PopUp.jsx';
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler.js';

let showReportPopup;

export const ReportPopup = () => {
  const [reason, setReason] = useState('')
  const [visible, setVisible] = useState(false);
  const [reportedType, setReportedType] = useState(null);
  const [postId, setPostId] = useState(null);
  const { user } = useAuth()
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) {
      return
    }
  })

  showReportPopup = async (type, postId) => {
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

      const data = await response.json();
      if (!response.ok) {
        toast.error(t(errorHandler(data)))
        return;
      }
      setReason(null);
      toast.success(t(reportedType === "comment" ? "success.report.comment" : "success.report.request"))
      closePopup();
      //showPopUp("Reporte reportado satisfactoriamente");
      
    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  }

  const closePopup = () => {
    setVisible(false);
  }

  if (!visible) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={closePopup}>X</button>
        <form onSubmit={handleNewReport}>
          <h4>{t(reportedType === "comment" ? "reports.comment" : "reports.request")}</h4>
          <textarea name="" id="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
          <input type="submit" value={t("reports.send")} />
        </form>
      </div>
    </div>,
    document.body
  );
};

export { showReportPopup };
export default ReportPopup;