import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/styles/ReportPopup.css'
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import { errorHandler } from '../../utils/errorHandler.js';
import { SubmitButton } from '../../components/SubmitButton.jsx';

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

    } catch (error) {
      toast.error(t(errorHandler(error)))
    }
  }

  const closePopup = () => {
    setVisible(false);
  }

  if (!visible) return null;

  return createPortal(
    <div className="report-popup-overlay">
      <div className="report-popup-content bg-persona-dark-red -skew-x-4">
        <button className="report-popup-close" onClick={closePopup}>X</button>
        <form onSubmit={handleNewReport}>
          <h4 className="text-4xl mb-[.5em]">{t(reportedType === "comment" ? "reports.comment" : "reports.request")}</h4>
          <textarea className="form-input-container form-input-1" name="" id="reason" value={reason} onChange={(e) => setReason(e.target.value)}></textarea>
          <SubmitButton className="w-[90%]" text={t("reports.send")}></SubmitButton>
        </form>
      </div>
    </div>,
    document.body
  );
};

export { showReportPopup };
export default ReportPopup;