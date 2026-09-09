import api from './api';

/**
 * Auth Service
 * Login, logout, and session verification calls.
 */

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // { success, data: { token, user, expiresAt } }
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data; // { success, data: user }
};

export const changePassword = async (data) => {
  const response = await api.put('/auth/password', data);
  return response.data;
};

export const seedAdmin = async () => {
  const response = await api.post('/auth/seed');
  return response.data;
};
