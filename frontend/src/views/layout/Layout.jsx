import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../menu/Menu.jsx";
import { useLocation } from 'react-router-dom';

export const Layout = ({ isMuted, toggleMute }) => {
  const location = useLocation();
  const hideMenu = ['/register', '/login', '/forgot-password', '/verify-email', '/reset-password'].includes(location.pathname);
  const hideBackground = ['/chat', '/profile'].some(prefix => location.pathname.startsWith(prefix));

  return (
    <div className="flex flex-col h-screen">
      {!hideMenu && <div className="fixed top-0 left-0 w-full z-50 bg-black">
        <Menu isMuted={isMuted} toggleMute={toggleMute} />
      </div>}
      <main className={`flex-1 overflow-y-auto ${hideBackground ? 'bg-persona-dark-red' : 'home'}`}>
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};