import React, { useState } from 'react'
import { API_URL } from '../constants/constants.js'
import '../assets/requests/RequestDetail.css'

import { useNavigate, Link } from 'react-router-dom'

import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next'
import { showReportForm } from './report/Report.jsx';
import { useAuth } from '../context/AuthContext.jsx';

let showPopUp;

export const PopUp = () => {
  const [text, setText] = useState(null)
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { user } = useAuth();
  const { t } = useTranslation();

  showPopUp = async (text) => {
    setLoading(true);
    setVisible(true);
    setText(text);
  }

  const closePopup = () => {
    setVisible(false);
  }

  if (!visible) return null;

  return createPortal(
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={closePopup}>x</button>
        <p>{text}</p>
      </div>
    </div>,
    document.body
  );
};

export { showPopUp };
export default PopUp;