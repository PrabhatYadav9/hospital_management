import api from './api';

/**
 * Dashboard Service
 * Fetches aggregated statistics from the backend.
 */

export const fetchDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data; // { success, data: { totalPatients, totalAdmitted, ... } }
};
