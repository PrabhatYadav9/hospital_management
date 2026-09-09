import api from './api';

/**
 * Doctor Service — CRUD + seed calls.
 */

export const fetchDoctors = async (params = {}) => {
  const response = await api.get('/doctors/', { params });
  return response.data; // { success, data: [], meta }
};

export const fetchDoctorById = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}`);
  return response.data;
};

export const createDoctor = async (doctorData) => {
  const response = await api.post('/doctors/', doctorData);
  return response.data;
};

export const updateDoctor = async (doctorId, doctorData) => {
  const response = await api.put(`/doctors/${doctorId}`, doctorData);
  return response.data;
};

export const deleteDoctor = async (doctorId) => {
  const response = await api.delete(`/doctors/${doctorId}`);
  return response.data;
};

export const fetchDoctorPatients = async (doctorId) => {
  const response = await api.get(`/doctors/${doctorId}/patients`);
  return response.data;
};

export const seedDoctors = async () => {
  const response = await api.post('/doctors/seed');
  return response.data;
};
