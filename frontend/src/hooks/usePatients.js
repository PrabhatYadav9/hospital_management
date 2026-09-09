import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
  dischargePatient,
} from '../services/patientService';

/**
 * usePatients hook
 * Manages patient list state and exposes CRUD handlers with loading/error states.
 * Used by Patients.jsx and Dashboard.jsx.
 */
export function usePatients() {
  const [patients, setPatients] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadPatients = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchPatients(params);
      setPatients(res.data || []);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load patients.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAdd = useCallback(async (patientData) => {
    const toastId = toast.loading('Admitting patient...');
    try {
      const res = await createPatient(patientData);
      toast.success('Patient admitted successfully!', { id: toastId });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to admit patient.';
      const errors = err.response?.data?.errors;
      toast.error(errors ? errors.join('\n') : msg, { id: toastId });
      throw err;
    }
  }, []);

  const handleUpdate = useCallback(async (patientId, patientData, refetchParams = {}) => {
    const toastId = toast.loading('Updating patient record...');
    try {
      const res = await updatePatient(patientId, patientData);
      setPatients(prev =>
        prev.map(p => (p.patientId === patientId ? res.data : p))
      );
      toast.success('Patient record updated!', { id: toastId });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update patient.';
      toast.error(msg, { id: toastId });
      throw err;
    }
  }, []);

  const handleDischarge = useCallback(async (patientId) => {
    const toastId = toast.loading('Processing discharge...');
    try {
      const res = await dischargePatient(patientId);
      setPatients(prev =>
        prev.map(p => (p.patientId === patientId ? res.data : p))
      );
      toast.success(res.message || 'Patient discharged successfully!', { id: toastId });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to discharge patient.';
      toast.error(msg, { id: toastId });
      throw err;
    }
  }, []);

  const handleDelete = useCallback(async (patientId) => {
    const toastId = toast.loading('Deleting patient record...');
    try {
      await deletePatient(patientId);
      setPatients(prev => prev.filter(p => p.patientId !== patientId));
      toast.success('Patient record deleted.', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete patient.';
      toast.error(msg, { id: toastId });
      throw err;
    }
  }, []);

  return {
    patients,
    meta,
    isLoading,
    error,
    loadPatients,
    handleAdd,
    handleUpdate,
    handleDischarge,
    handleDelete,
  };
}
