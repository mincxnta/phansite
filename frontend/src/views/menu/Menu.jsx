import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SettingsMenu } from "./SettingsMenu.jsx";
import { toast } from "react-toastify";
import "../../assets/styles/Menu.css";

export const Menu = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const settingsMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileButtonRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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
    toast.success(t("success.logout"));
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const links = [
    {
      to: "/",
      label: t("home.title"),
    },
    {
      to: user && user.role === "phantom_thief" ? "/thieves" : "/requests",
      label: t("requests.title"),
    },
    ...(user
      ? [
          {
            to: "/chat",
            label: t("chat.title"),
          },
        ]
      : []),
    ...(user && user.role === "admin"
      ? [
          {
            to: "/admin/users",
            label: t("admin.users"),
          },
          {
            to: "/admin/reports",
            label: t("admin.reports"),
          },
          {
            to: "/admin/poll",
            label: t("home.poll"),
          },
        ]
      : []),
  ];

  return (
    <>
      <nav className="bg-black border-b-2 border-white flex items-center justify-between px-6 py-4 w-full">
          <button
    className="text-white text-3xl md:hidden focus:outline-none"
    onClick={toggleMobileMenu}
    title={t("menu.toggle")}
  >
    ☰
  </button>
        <ul
          className={`
    list-none font-earwig text-[3em] md:text-[1.25em] lg:text-[2em]
    ${
      isMobileMenuOpen
        ? "fixed top-0 left-0 w-full h-full bg-black z-50 flex flex-col items-center justify-center gap-10"
        : "hidden"
    }
    md:flex md:flex-row xl:gap-8 md:static md:h-auto md:w-auto
  `}
        >
          {links.map((link, index) => (
            <li
              key={link.to}
              className={`link-wrapper w-full md:w-auto text-center`}
            >
              <Link
                to={link.to}
                className="link-text block w-full md:w-auto"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="menu-text text-white">{link.label}</span>
                <div className="shape-wrapper">
                  <div className="shape red-fill jelly">
                    <svg x="0px" y="0px" viewBox="0 0 108.1 47">
                      <polygon
                        fill="#0055FF"
                        points="29.5,8.5 150.7,0 108.1,32.7 3.1,47 "
                      />
                    </svg>
                  </div>
                  <div className="shape cyan-fill jelly">
                    <svg x="0px" y="0px" viewBox="0 0 108.1 47">
                      <polygon
                        fill="#FF0000"
                        points="0.3,17 125.1,0 68.8,45.6 24.3,39 "
                      />
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
            title={t("settingsMenu.open")}
            className="text-white text-2xl focus:outline-none"
          >
            <img
              className="w-6 h-auto"
              src="/assets/images/icons/settings.png"
            />
          </button>
          <div className="relative">
            <div
              onClick={toggleProfileMenu}
              ref={profileButtonRef}
              title={t("profileMenu.open")}
              className="cursor-pointer"
            >
              {user ? (
                <img
                  src={
                    user.profilePicture || "/assets/images/unknownTarget.png"
                  }
                  alt={t("profile.title")}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <li className="font-earwig text-4xl list-none whitespace-nowrap">
                  <Link to="/login">{t("auth.login")}</Link>
                </li>
              )}
            </div>
            {user && isProfileMenuOpen && (
              <div
                ref={profileMenuRef}
                className="bg-black fixed top-17 right-5 py-5 -skew-x-6 flex flex-col gap-5 text-xl"
                style={{
                  boxShadow: "6px 4px 0 white",
                }}
              >
                <Link
                  to="/profile"
                  onClick={closeProfileMenu}
                  className="table-text px-8"
                >
                  {t("profile.title")}
                </Link>
                <button onClick={handleLogout} className="table-text px-8">
                  {t("auth.logout")}
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
