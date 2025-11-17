import { get, post, put, del } from '@/utils/apiUtils';

// User/Guest Endpoints
export const register = (userData) => post('/auth/register', userData);
export const login = (userData) => post(`/auth/login`, userData);


//for patients Endpoints
export const createPatient = (patientsData) => post('/patients', patientsData);
export const updatePatient = (id, patientsData) => put(`/patients/${id}`, patientsData);
export const deletePatient = (id) => del(`/patients/${id}`);
export const getPatients = () => get('/patients');


//for consultation 
export const createConsultation = (consultationsData) => post('/consultations', consultationsData);
export const updateConsultation = (id, consultationsData) => put(`/consultations/${id}`, consultationsData);
export const completeConsultation = (id, consultationsData) => put(`/consultations/${id}/complete`, consultationsData);
export const getConsultations = () => get('/consultations');

