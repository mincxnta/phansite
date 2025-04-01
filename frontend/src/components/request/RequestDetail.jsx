import React, { useState } from 'react'
import { API_URL } from '../../constants/constants.js'
import '../../assets/requests/RequestDetail.css'
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next'

let showRequestDetail;

export const RequestDetail = () => {
    const [request, setRequest] = useState(null)
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    showRequestDetail = async (requestId) => {
        setLoading(true);
        setVisible(true);
        try {
            const url = `${API_URL}/requests/${requestId}`;

            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            })

            if (!response.ok) {
                setRequest(null);
                setLoading(false);
                return;

            }
            const data = await response.json()
            setRequest(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setRequest(null);
            setLoading(false);
        }
    }

    const closePopup = () => {
        setVisible(false);
    }

    if (!visible) return null;

    return createPortal(
        <div className="popup-overlay">
          {loading ? (
            <div>Carregant...</div>
          ) : request ? (
            <div className="popup-content">
              <button className="popup-close" onClick={closePopup}>x</button>
              <h2>{request.status}</h2>
              <h1>{request.title}</h1>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <h3>{t("requests.target")}</h3>
                    </td>
                    <td>
                      <h3>{t("requests.target.image")}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>{request.target}</p>
                    </td>
                    <td rowSpan="3">
                      <img
                        src={request.image ? request.image : '/assets/requests/unknownTarget.png'}
                        alt={request.target}
                        style={{ width: '200px' }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <h3>{t("requests.description")}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p>{request.description}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div>No s'han pogut carregar els detalls</div>
          )}
        </div>,
        document.body
      );
    };

export { showRequestDetail };
export default RequestDetail;