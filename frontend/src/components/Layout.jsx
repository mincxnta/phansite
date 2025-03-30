import React from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "./Menu.jsx";


export const Layout = () => {

  return (
    <div>
      <Menu />
      <main>
        <Outlet />
      </main>
    </div>
  );
};