import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const login = (token, userId, isAdminStatus) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_id', userId);
        setIsLoggedIn(true);
        setIsAdmin(isAdminStatus);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
