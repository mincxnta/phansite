import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "./Menu.jsx";

export const Layout = ({ isMuted, toggleMute, volume, setVolume }) => {

  return (
    <div>
      <Menu isMuted={isMuted} toggleMute={toggleMute} volume={volume} setVolume={setVolume}/>
      <main>
        <Outlet />
      </main>
    </div>
  );
};