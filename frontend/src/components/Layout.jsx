import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu } from "./Menu.jsx";
import { useState, useEffect } from "react";
import { getAuthUser } from "../utils/auth.js";

export const Layout = () => {
  const [authUser, setAuthUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuthUser = async () => {
      try {
        const authData = await getAuthUser();
        setAuthUser(authData);
      } catch (error) {
        console.log(error);
        setAuthUser(null);
      }
    };
    checkAuthUser();
  }, [location.pathname])

  return (
    <div>
      <Menu authUser={authUser} setAuthUser={setAuthUser} />
      <main>
        <Outlet context={{ authUser, setAuthUser }} />
      </main>
    </div>
  );
};