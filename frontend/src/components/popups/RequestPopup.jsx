import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/requests/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { showPopUp } from './PopUp.jsx';

let showRequestPopup;

export const RequestPopup = () => {
    const [message, setMessage] = useState('')
    const [visible, setVisible] = useState(false);
    const [status, setStatus] = useState('pending')
    const [id, setId] = useState(null);
    const [onSuccess, setOnSuccess] = useState(null);
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        if (!user) {
            return
        }
    })

    showRequestPopup = (id, status, callback) => {
        setStatus(status);
        setVisible(true);
        setOnSuccess(() => callback);
        setId(id);
    }

    const handleUpdateRequest = async (event) => {

        event.preventDefault();
        const updatedData = { status }
        if (message) {
            updatedData.thiefComment = message
        }

        try {
            const response = await fetch(`${API_URL}/requests/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })

            if (response.ok) {
                closePopup();
                showPopUp("Se ha actualizado la solicitud satisfactoriamente");
                if (onSuccess) {
                    onSuccess();
                  }
            }
        } catch (error) {
            return error;
        }
    }

    const closePopup = () => {
        setVisible(false);
        setMessage('')
        setOnSuccess(null);
    }

    if (!visible) return null;

    return createPortal(
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="popup-close" onClick={closePopup}>X</button>
                <form onSubmit={handleUpdateRequest}>
                    <h4>{t("reports.reason")}</h4>
                    <textarea name="" id="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    <input type="submit" value={t("reports.send")} />
                </form>
            </div>
        </div>,
        document.body
    );
};

export { showRequestPopup };
export default RequestPopup;