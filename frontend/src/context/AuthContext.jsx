import { createContext, useContext, useEffect, useState } from "react";
import { API_URL, SOCKET_URL } from "../constants/constants.js";
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'
import { errorHandler } from '../utils/errorHandler.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null)
    const [onlineUsers, setOnlineUsers] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();

    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/user`, {
                method: 'GET',
                credentials: 'include'
            });

            const data = await response.json();
            if (response.ok) {
                if (data && data.banned) {
                    await logout();
                    navigate('/login')
                }
                setUser(data)
            } else {
                setUser(null);
            }
            return user;
        } catch (error) {
            toast.error(t(errorHandler(error)))
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json()

            if (!response.ok) {
                return data;
            }

            setUser(data)
            connectSocket()
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

            disconnectSocket()
            setUser(null);
            setOnlineUsers([])
            navigate('/login');
            return true;
        } catch (error) {
            return error;
        }
    };

    const connectSocket = () => {
        if (!user || socket?.connected) return;

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            query: { userId: user.id }
        });

        newSocket.on('getOnlineUsers', (userIds) => {
            setOnlineUsers(userIds);
        });

        newSocket.connect();
        setSocket(newSocket);
    };

    const disconnectSocket = () => {
        if (socket?.connected) {
            socket.disconnect();
            setSocket(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (user && !socket?.connected) {
            connectSocket();
        } else if (!user && socket?.connected) {
            disconnectSocket();
        }
    }, [user]);

    useEffect(() => {
        return () => {
            disconnectSocket();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser, login, logout, socket, onlineUsers }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
