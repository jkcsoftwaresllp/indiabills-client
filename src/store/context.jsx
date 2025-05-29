import { createContext, useState } from 'react';
import { getSession, createSession, clearSession } from '../utils/cacheHelper';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSession());

  const login = (userData) => {
    createSession(userData);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    console.info("Logged out!");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

