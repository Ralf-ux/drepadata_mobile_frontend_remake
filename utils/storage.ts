// Re-export all types and storage functions for backward compatibility
export * from './types';
export * from './storage/patientStorage';
export * from './storage/consultationStorage';
export * from './storage/followUpStorage';
export * from './storage/vaccinationStorage';
export { getPatientIdentities, PatientIdentity } from './api';
