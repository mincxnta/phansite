import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'
import { RequestList } from "../request/RequestList.jsx"

export const ThiefPanel = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        const verifyThief = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'phantom_thief') {
                navigate('/');
            }
        }
        verifyThief();
    }, [navigate, user])

    return (
        <div>
            <h1>{t("phantom.thief.title")}</h1>
            <RequestList />
        </div>
    )
}