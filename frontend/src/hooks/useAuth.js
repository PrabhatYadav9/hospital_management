import { useState, useCallback } from 'react';
import { login as loginService, logout as logoutService, getMe } from '../services/authService';

const TOKEN_KEY = 'hms_token';
const USER_KEY = 'hms_user';

/**
 * useAuth hook
 * Manages authentication state, persisted in localStorage.
 */
export function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await loginService(email, password);
      console.log('Login Response:', res);
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Login Error:', err);
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch {
      // Silently fail — logout should always clear local state
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    }
  }, []);

  const verifySession = useCallback(async () => {
    if (!token) return false;
    try {
      const res = await getMe();
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
      return true;
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      return false;
    }
  }, [token]);

  return { user, token, isAuthenticated, isLoading, error, login, logout, verifySession };
}
