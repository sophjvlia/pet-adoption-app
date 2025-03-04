import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setUser(user);
      setIsLoggedIn(true);
      setIsAdmin(user.is_admin === 1);
    } else {
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsLoggedIn(true);
    setIsAdmin(user.is_admin === 1);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
