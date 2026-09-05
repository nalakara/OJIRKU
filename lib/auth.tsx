
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { getSetting, setSetting } from './db';

interface AuthContextType {
  isAuthenticated: boolean;
  isPinSet: boolean;
  authStatus: 'loading' | 'ready';
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  setPin: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    const checkPin = async () => {
      const storedPin = await getSetting('pin');
      setIsPinSet(!!storedPin);
      setAuthStatus('ready');
    };
    checkPin();
  }, []);

  const login = useCallback(async (pin: string): Promise<boolean> => {
    const storedPin = await getSetting('pin');
    if (storedPin && storedPin.value === pin) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const setPin = useCallback(async (pin: string) => {
    await setSetting('pin', pin);
    setIsPinSet(true);
    setIsAuthenticated(true); // Authenticate immediately after setting a new PIN
  }, []);
  
  const value = { isAuthenticated, isPinSet, authStatus, login, logout, setPin };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};