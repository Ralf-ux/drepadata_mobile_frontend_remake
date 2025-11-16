import { get, post, put, del } from '@/utils/apiUtils';

// User/Guest Endpoints
export const register = (userData) => post('/auth/register', userData);
export const login = (userData) => post(`/auth/login`, userData);


//for patients Endpoints
export const createPatient = (patientsData) => post('/patients', patientsData);
export const updatePatient = (id, patientsData) => put(`/patients/${id}`, patientsData);
export const deletePatient = (id) => del(`/patients/${id}`);
export const getPatients = () => get('/patients');


export const getUsers = () => get('/users');
export const updateUser = (id, userData) => put(`/users/${id}`, userData);
export const deleteUser = (id) => del(`/users/${id}`);
export const updateUserPassword = (id, passwordData) => put(`/users/${id}/password`, passwordData);
export const uploadProfileImage = (id, imageData) => put(`/users/${id}/profile-image`, imageData, { headers: { 'Content-Type': 'multipart/form-data' } });