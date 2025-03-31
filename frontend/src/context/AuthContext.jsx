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

            if (!response.ok) {
                setUser(null);
                return;
            }

            const data = await response.json();
            setUser(data || null);

        } catch (error) {
            console.log(error)
            setUser(null);
        }
        setLoading(false);
    };

    const login = async (username, password) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message)
            }
            
            const data = await response.json()
            setUser(data)
            navigate('/')
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error during logout');
            }

            setUser(null); // Esborra l'usuari del context
            navigate('/login'); // Redirigeix al login
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

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
