
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

interface StoredPinData {
  hash: string;
  salt: string;
}

export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 16; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const hashPin = async (pin: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${salt}:${pin}`);
  if (typeof crypto !== 'undefined' && crypto.subtle && crypto.subtle.digest) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback if Web Crypto Subtle is unavailable
  let h = 0;
  const str = `${salt}:${pin}`;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h).toString(16);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPinSet, setIsPinSet] = useState(false);
  const [authStatus, setAuthStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    const checkPin = async () => {
      const storedPin = await getSetting('pin');
      setIsPinSet(!!storedPin && storedPin.value !== null && storedPin.value !== undefined);
      setAuthStatus('ready');
    };
    checkPin();
  }, []);

  const login = useCallback(async (pin: string): Promise<boolean> => {
    const storedPin = await getSetting('pin');
    if (!storedPin || storedPin.value === null || storedPin.value === undefined) {
      return false;
    }

    const val = storedPin.value;

    // Backward-compatible transparent migration for legacy plaintext PIN strings
    if (typeof val === 'string') {
      if (val === pin) {
        const salt = generateSalt();
        const hash = await hashPin(pin, salt);
        await setSetting('pin', { hash, salt });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    }

    // Modern salted SHA-256 validation
    if (typeof val === 'object' && val.hash && val.salt) {
      const computedHash = await hashPin(pin, val.salt);
      if (computedHash === val.hash) {
        setIsAuthenticated(true);
        return true;
      }
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const setPin = useCallback(async (pin: string) => {
    const salt = generateSalt();
    const hash = await hashPin(pin, salt);
    await setSetting('pin', { hash, salt });
    setIsPinSet(true);
    setIsAuthenticated(true);
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