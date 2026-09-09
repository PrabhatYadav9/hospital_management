import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  fetchDoctors as fetchDoctorsApi,
  createDoctor as createDoctorApi,
  updateDoctor as updateDoctorApi,
  deleteDoctor as deleteDoctorApi,
  seedDoctors as seedDoctorsApi
} from '../services/doctorService';

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDoctors = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchDoctorsApi(params);
      setDoctors(res.data);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load doctors.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCreate = async (data) => {
    try {
      await createDoctorApi(data);
      toast.success('Doctor added successfully.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor.');
      return false;
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateDoctorApi(id, data);
      toast.success('Doctor updated successfully.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update doctor.');
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctorApi(id);
      toast.success('Doctor removed.');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete doctor.');
      return false;
    }
  };

  const handleSeed = async () => {
    try {
      const res = await seedDoctorsApi();
      toast.success(res.message);
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to seed doctors.');
      return false;
    }
  };

  return {
    doctors,
    meta,
    isLoading,
    error,
    loadDoctors,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSeed
  };
}
