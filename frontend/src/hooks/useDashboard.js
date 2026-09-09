import { useState, useCallback } from 'react';
import { fetchDashboardStats } from '../services/dashboardService';

/**
 * useDashboard hook
 * Loads aggregated dashboard statistics from the backend.
 */
export function useDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardStats();
      setStats(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load dashboard stats.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { stats, isLoading, error, loadStats };
}
