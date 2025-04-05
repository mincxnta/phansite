import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../constants/constants.js";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/user`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                console.log(data)
                if (data.banned) {
                    await logout();
                    navigate('/login')
                }
                setUser(data)
            } else {
                setUser(null);
            }
            return user;
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json()

            if (!response.ok) {
                return data;
            }

            setUser(data)
            return true;
        } catch (error) {
            return error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                const data = await response.json();
                return data;
            }

            setUser(null);
            navigate('/login');
            return true;
        } catch (error) {
            return error;
        }
    };;

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
