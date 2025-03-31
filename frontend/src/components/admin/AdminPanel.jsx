import { useEffect } from "react"
import { UserList } from "./UserList.jsx"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from '../../context/AuthContext.jsx';
import { useTranslation } from 'react-i18next'

export const AdminPanel = () => {
    const navigate = useNavigate()
    const {user} = useAuth()
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
            <h1>{t("admin.panel")}</h1>
            <h4>{t("users")}</h4>
            <h5>{t("users.list")}</h5>
            <UserList />
            <h5>{t("user.create")}</h5>
            <button> <Link to="create">{t("user.create")}</Link></button>
        </div>
    )
}