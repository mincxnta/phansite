import React, { useEffect, useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/components/request-detail/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify';
import { SubmitButton } from '../../components/SubmitButton.jsx';

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
                const updatedRequest = await response.json();
                toast.success(t("success.update.request"))
                closePopup();

                if (onSuccess) {
                    onSuccess(updatedRequest);
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
            <div className="report-popup-content bg-persona-dark-red -skew-x-4">
                <button className="report-popup-close" onClick={closePopup}>X</button>
                <form onSubmit={handleUpdateRequest}>
                    <h4 className="text-4xl mb-[.5em]">{t("requests.popup")}</h4>
                    <textarea className="form-input-container form-input-1" name="" id="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    <SubmitButton text={t(status === "rejected" ? "requests.reject" : "requests.complete")}></SubmitButton>
                </form>
            </div>
        </div>,
        document.body
    );
};

export { showRequestPopup };
export default RequestPopup;