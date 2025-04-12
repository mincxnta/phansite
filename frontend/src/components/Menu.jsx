import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export const Menu = () => {
    const { user } = useAuth()
    const { t } = useTranslation();

    return (
        <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", backgroundColor: "black" }}>
            {/* COMMON */}
            <button>
                <Link to="/">{t("home.title")}</Link>
            </button>
            <button>
                <Link to={user && user.role == "phantom_thief" ? "/thieves" : "/requests"}> {t("requests.title")}</Link>
            </button>
            <button>
                <Link to={user ? "/profile" : "/login"}>
                    {user ? t("profile.title") : t("auth.login")}
                </Link>
            </button>

            {/* USUARIOS */}
            {user &&
                <button>
                    <Link to="/chat">
                        {t("chat.title")}
                    </Link>
                </button>
            }

            {/* ADMIN */}
            {user && user.role === 'admin' &&
                <button>
                    <Link to="/admin/users">
                        {t("admin.users")}
                    </Link>
                </button>
            }
            {user && user.role === 'admin' &&
                <button>
                    <Link to="/admin/reports">
                        {t("admin.reports")}
                    </Link>
                </button>
            }
            <LanguageSwitcher />
        </nav >
    )
}