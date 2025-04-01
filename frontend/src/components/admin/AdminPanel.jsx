import { useEffect } from "react"
import { UserList } from "./UserList.jsx"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const AdminPanel = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { t } = useTranslation();

    useEffect(() => {
        const verifyAdmin = () => {
            if (!user) {
                navigate('/login');
                return;
            }

            if (user.role !== 'admin') {
                navigate('/');
            }
        }
        verifyAdmin();
    }, [navigate, user])

    return (
        <div>
            <h1>{t("admin.title")}</h1>
            <h4>{t("users.title")}</h4>
            <h5>{t("users.list")}</h5>
            <UserList />
            <h5>{t("users.create")}</h5>
            <button> <Link to="create">{t("users.create")}</Link></button>
            <button> <Link to="reportlist">{t("admin.reportList")}</Link></button>
        </div>
    )
}