import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsMenu } from './SettingsMenu.jsx';
import { toast } from 'react-toastify';
import '../../assets/components/menu/Menu.css';

export const Menu = () => {
  const { user, logout } = useAuth();
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
  };

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

  const links = [
    {
      to: '/',
      label: t('home.title'),
    },
    {
      to: user && user.role === 'phantom_thief' ? '/thieves' : '/requests',
      label: t('requests.title'),
    },
    ...(user
      ? [
          {
            to: '/chat',
            label: t('chat.title'),
          },
        ]
      : []),
    ...(user && user.role === 'admin'
      ? [
          {
            to: '/admin/users',
            label: t('admin.users'),
          },
          {
            to: '/admin/reports',
            label: t('admin.reports'),
          },
          {
            to: '/admin/poll',
            label: t('home.poll'),
          },
        ]
      : []),
  ];

  return (
    <>
      <nav className="bg-black border-b-2 border-white flex items-center justify-between px-6 py-4 w-full">
        <ul className="flex w-full justify-around list-none font-earwig text-4xl">
          {links.map((link, index) => (
            <li key={link.to} className={`link-wrapper ${index % 2 === 1 ? 'even' : ''}`}>
              <Link to={link.to} className="link-text">
                <span className="fallback">{link.label}</span>
                <span className="menu-text">{link.label}</span>
                <div className="shape-wrapper">
                  <div className="shape red-fill jelly">
                    <svg x="0px" y="0px" viewBox="0 0 108.1 47" enableBackground="new 0 0 108.1 47">
                      <polygon fill="#FF0000" points="29.5,8.5 150.7,0 108.1,32.7 3.1,47 " />
                    </svg>
                  </div>
                  <div className="shape cyan-fill jelly">
                    <svg x="0px" y="0px" viewBox="0 0 108.1 47" enableBackground="new 0 0 108.1 47">
                      <polygon fill="#00FFFF" points="0.3,17 125.1,0 68.8,45.6 24.3,39 " />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSettings}
            title={t('settingsMenu.open')}
            className="text-white text-2xl focus:outline-none"
          >
            ⚙️
          </button>
          <div className="relative">
            <div
              onClick={toggleProfileMenu}
              ref={profileButtonRef}
              title={t('profileMenu.open')}
              className="cursor-pointer"
            >
              {user ? (
                <img
                  src={user.profilePicture || '/assets/requests/unknownTarget.png'}
                  alt={t('profile.title')}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <li className="font-earwig text-4xl list-none">
                  <Link to="/login">{t('auth.login')}</Link>
                </li>
              )}
            </div>
            {user && isProfileMenuOpen && (
              <div
                ref={profileMenuRef}
                className="fixed top-12 right-4 bg-gray-800 border-2 border-red-600 rounded-lg z-50 flex flex-col gap-2 p-2 min-w-[150px]"
              >
                <Link
                  to="/profile"
                  onClick={closeProfileMenu}
                  className="block p-2 bg-red-600 text-white rounded text-center"
                >
                  {t('profile.title')}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full p-2 bg-red-600 text-white rounded text-center"
                >
                  {t('auth.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isSettingsOpen && (
        <div ref={settingsMenuRef}>
          <SettingsMenu />
        </div>
      )}
      {!user && <Link to="/login" className="hidden" />}
    </>
  );
};