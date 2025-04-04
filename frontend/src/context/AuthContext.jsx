import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../constants/constants.js";
import { useNavigate } from 'react-router-dom';
import { errorHandler } from "../utils/errorHandler.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

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
                setError(null);
            } else {
                setUser(null);
                setError(errorHandler(data));
            }
        } catch (error) {
            setUser(null);
            setError(errorHandler(error));
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
                setError(errorHandler(data));
                return false;
            }

            setUser(data)
            setError(null);
            return true;
        } catch (error) {
            setError(errorHandler(error));
            return false;
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
                setError(errorHandler(data));
                return false;
            }

            setUser(null);
            setError(null);
            navigate('/login');
            return true;
        } catch (error) {
            setError(errorHandler(error));
            return false;
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
