import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hollow_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hollow_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      if (token) {
        try {
          const currentUser = await api.auth.getCurrentUser();
          if (currentUser) setUser(currentUser);
        } catch {
          // ignore session restore errors
        }
      }
      setLoading(false);
    }
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const register = async (name, email, password) => {
    const res = await api.auth.register(name, email, password);
    setUser(res.user);
    setToken(res.token);
    return res;
  };

  const loginAsGuest = () => {
    const demoUser = {
      id: 'demo_user',
      name: 'Guest Explorer',
      email: 'guest@hollow.finance',
      currency: 'INR',
      role: 'guest',
      isGuest: true,
    };
    // Clean any prior stored transactions or budgets so guest always starts fresh at 0
    localStorage.removeItem('hollow_tx_demo_user');
    localStorage.removeItem('hollow_budgets_demo_user');
    localStorage.removeItem('hollow_transactions');
    localStorage.removeItem('hollow_budgets');
    localStorage.setItem('hollow_token', 'demo_jwt_token_123');
    localStorage.setItem('hollow_current_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setToken('demo_jwt_token_123');
  };

  const logout = () => {
    const isGuest = user?.isGuest || user?.id === 'demo_user' || user?.role === 'guest';
    api.auth.logout();

    if (isGuest) {
      // ONLY clear temporary guest session data
      localStorage.removeItem('hollow_tx_demo_user');
      localStorage.removeItem('hollow_budgets_demo_user');
      localStorage.removeItem('hollow_transactions');
      localStorage.removeItem('hollow_budgets');
    }
    // Registered accounts KEEP their hollow_tx_<userId> and hollow_budgets_<userId> safely preserved in storage!

    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates) => {
    const updated = await api.auth.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!user, login, register, loginAsGuest, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
