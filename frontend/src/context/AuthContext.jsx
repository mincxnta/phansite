import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../constants/constants.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
