import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { SettingsMenu } from './SettingsMenu.jsx'
import { toast } from 'react-toastify'

export const Menu = ({ isMuted, toggleMute, volume, setVolume }) => {
    const { user, logout } = useAuth()
    const { t } = useTranslation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const settingsMenuRef = useRef(null);
    const profileMenuRef = useRef(null);
    const profileButtonRef = useRef(null);

    const toggleSettings = () => {
        setIsSettingsOpen((prev) => !prev);
        setIsProfileMenuOpen(false);
    };

    const toggleProfileMenu = () => {
        if (user) {
            setIsProfileMenuOpen((prev) => !prev);
            setIsSettingsOpen(false);
        }
    }

    const closeSettings = () => {
        setIsSettingsOpen(false);
    };

    const closeProfileMenu = () => {
        setIsProfileMenuOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        toast.success(t('success.logout'));
        closeProfileMenu();
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                settingsMenuRef.current &&
                !settingsMenuRef.current.contains(event.target) &&
                !event.target.closest('button[title="settingsMenu.open"]')
            ) {
                closeSettings();
            }

            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target) &&
                profileButtonRef.current &&
                !profileButtonRef.current.contains(event.target)
            ) {
                closeProfileMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <>
            <nav style={{ display: "flex", width: "100vw", justifyContent: "space-between", alignItems: "center", backgroundColor: "black" }}>
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
                {user && user.role === 'admin' &&
                    <button>
                        <Link to="/admin/poll">
                            {t("home.poll")}
                        </Link>
                    </button>
                }
                <button
                    onClick={toggleSettings}
                    title={t('settingsMenu.open')}
                >
                    ⚙️
                </button>
                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <div onClick={toggleProfileMenu}
                        ref={profileButtonRef}
                        title={t('profileMenu.open')}>
                        {user ? (<img src={user.profilePicture || '/assets/requests/unknownTarget.png'}
                            alt={t('profile.title')}
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                            }}></img>) : (<Link to="/login">{t('auth.login')}</Link>)}
                    </div>
                    {user && isProfileMenuOpen && (
                        <div
                            ref={profileMenuRef}
                            style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                backgroundColor: '#1C2526',
                                border: '2px solid #AB0000',
                                borderRadius: '8px',
                                zIndex: 1000,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                padding: '10px',
                                minWidth: '150px',
                            }}
                        >
                            <Link
                                to="/profile"
                                onClick={closeProfileMenu}
                                style={{
                                    display: 'block',
                                    padding: '10px',
                                    backgroundColor: '#AB0000',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                }}
                            >
                                {t('profile.title')}
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#AB0000',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                {t('auth.logout')}
                            </button>
                        </div>
                    )}
                    {!user && (
                        <Link to="/login" style={{ display: 'none' }} />
                    )}
                </div>
            </nav >
            {isSettingsOpen && (
                <div ref={settingsMenuRef}>
                    <SettingsMenu
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                        volume={volume}
                        setVolume={setVolume}
                        closeMenu={closeSettings} />
                </div>
            )}
        </>
    )
}