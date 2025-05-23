/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, ReactNode } from 'react';
import { getSession, createSession, clearSession } from '../utils/cacheHelper';
import {SessionPayload} from "../definitions/Types";

interface AuthContextType {
  user: any;
  login: (userData: SessionPayload) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState(getSession());

  const login = (userData: SessionPayload) => {
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