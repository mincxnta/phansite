import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsMenu } from './SettingsMenu.jsx'

export const Menu = ({ isMuted, toggleMute, volume, setVolume }) => {
    const { user } = useAuth()
    const { t } = useTranslation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const toggleSettings = () => {
        setIsSettingsOpen(!isSettingsOpen);
    };

    return (
        <>
            <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", backgroundColor: "black" }}>
                {/* COMMON */}
                <button>
                    <Link to="/">{t("home.title")}</Link>
                </button>
                <button>
                    <Link to={user && user.role == "phantom_thief" ? "/thieves" : "/requests"}> {t("requests.title")}</Link>
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
                <button
                    onClick={toggleSettings}
                    title={t('settingsMenu.open')}
                >
                    ⚙️
                </button>
                <button>
                    <Link to={user ? "/profile" : "/login"}>
                        {user ? t("profile.title") : t("auth.login")}
                    </Link>
                </button>
            </nav >
            {isSettingsOpen && (
                <SettingsMenu
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    volume={volume}
                    setVolume={setVolume}
                    closeMenu={() => setIsSettingsOpen(false)} />
            )}
        </>
    )
}