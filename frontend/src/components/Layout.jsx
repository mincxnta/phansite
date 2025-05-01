import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "./Menu.jsx";

export const Layout = ({ isMuted, toggleMute }) => {

  return (
    <div>
      <Menu isMuted={isMuted} toggleMute={toggleMute} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};