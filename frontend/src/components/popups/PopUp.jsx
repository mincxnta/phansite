import React, { useState } from 'react'
import '../../assets/requests/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next'

let showPopUp;

export const PopUp = () => {
  const [text, setText] = useState(null)
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
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