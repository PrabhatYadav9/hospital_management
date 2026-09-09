import api from './api';

/**
 * Patient Service
 * All patient-related API calls. Maps to /api/patients endpoints.
 */

export const fetchPatients = async (params = {}) => {
  const response = await api.get('/patients/', { params });
  return response.data; // { success, data, meta }
};

export const fetchPatientById = async (patientId) => {
  const response = await api.get(`/patients/${patientId}`);
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post('/patients/', patientData);
  return response.data;
};

export const updatePatient = async (patientId, patientData) => {
  const response = await api.put(`/patients/${patientId}`, patientData);
  return response.data;
};

export const deletePatient = async (patientId) => {
  const response = await api.delete(`/patients/${patientId}`);
  return response.data;
};

export const dischargePatient = async (patientId) => {
  const response = await api.patch(`/patients/${patientId}/discharge`);
  return response.data;
};
