import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "../menu/Menu.jsx";
import { useLocation } from 'react-router-dom';

export const Layout = ({ isMuted, toggleMute }) => {
  const location = useLocation();
  const hideMenu = ['/register', '/login'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      {!hideMenu && <Menu isMuted={isMuted} toggleMute={toggleMute} />}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};