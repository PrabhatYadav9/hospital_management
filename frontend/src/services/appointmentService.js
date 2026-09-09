import api from './api';

/**
 * Appointment Service — CRUD + today's schedule.
 */

export const fetchAppointments = async (params = {}) => {
  const response = await api.get('/appointments/', { params });
  return response.data;
};

export const fetchTodayAppointments = async () => {
  const response = await api.get('/appointments/today');
  return response.data;
};

export const fetchAppointmentById = async (appointmentId) => {
  const response = await api.get(`/appointments/${appointmentId}`);
  return response.data;
};

export const createAppointment = async (data) => {
  const response = await api.post('/appointments/', data);
  return response.data;
};

export const updateAppointment = async (appointmentId, data) => {
  const response = await api.put(`/appointments/${appointmentId}`, data);
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
  return response.data;
};

export const deleteAppointment = async (appointmentId) => {
  const response = await api.delete(`/appointments/${appointmentId}`);
  return response.data;
};
