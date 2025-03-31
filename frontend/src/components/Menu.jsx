import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'

export const Menu = () => {
    const { user } = useAuth()
    const { t } = useTranslation();

    return (
        <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", backgroundColor: "black" }}>
            <button>
                <Link to="/">{t("home")}</Link>
            </button>
            <button>
                <Link to="/requests">{t("requests")}</Link>
            </button>
            <button>
                <Link to={user ? "/profile" : "/login"}>
                    {user ? t("profile") : t("login")}
                </Link>
            </button>
        </nav>
    )
}