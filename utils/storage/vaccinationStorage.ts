import AsyncStorage from '@react-native-async-storage/async-storage';
import { vaccinationAPI } from '../api';
import { VaccinationRecord, STORAGE_KEYS } from '../types';

export const saveVaccination = async (vaccination: VaccinationRecord): Promise<void> => {
  try {
    // Save to MongoDB Atlas via API
    const vaccinationData = {
      patient_id: vaccination.patient_id,
      patient_name: vaccination.patient_name,
      patient_age: vaccination.patient_age,
      vaccinations: vaccination.vaccinations,
    };

    let response;
    if (vaccination.id && vaccination.id.length === 24) {
      // MongoDB ObjectId format - update
      response = await vaccinationAPI.update(vaccination.id, vaccinationData);
    } else {
      // Create new vaccination
      response = await vaccinationAPI.create(vaccinationData);
    }

    // Validate response structure
    if (!response || !response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    // Also save locally for offline access
    const vaccinations = await getVaccinations();
    const existingIndex = vaccinations.findIndex(v => v.id === vaccination.id);
    const timestamp = new Date().toISOString();
    const updatedVaccination = {
      ...vaccination,
      id: response.data._id || response.data.id || vaccination.id,
      updated_at: timestamp
    };

    if (existingIndex !== -1) {
      vaccinations[existingIndex] = updatedVaccination;
    } else {
      vaccinations.push(updatedVaccination);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(vaccinations));
  } catch (error) {
    console.error('Error saving vaccination:', error);
    throw error;
  }
};

export const getVaccinations = async (): Promise<VaccinationRecord[]> => {
  try {
    // Try to fetch from API first
    const response = await vaccinationAPI.getAll();
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const vaccinations: VaccinationRecord[] = response.data.map((vaccination: any) => ({
        id: vaccination._id || vaccination.id,
        patient_id: vaccination.patient_id,
        patient_name: vaccination.patient_name,
        patient_age: vaccination.patient_age,
        vaccinations: vaccination.vaccinations || {},
        updated_at: vaccination.updated_at || new Date().toISOString(),
      }));

      // Save to local storage for offline access
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(vaccinations));
      return vaccinations;
    }

    // Fallback to local storage if API fails
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting vaccinations from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.error('Error getting vaccinations from local storage:', localError);
      return [];
    }
  }
};

export const getVaccinationsByPatientId = async (patientId: string): Promise<VaccinationRecord[]> => {
  try {
    // Try to fetch from API first
    const response = await vaccinationAPI.getByPatientId(patientId);
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const vaccinations: VaccinationRecord[] = response.data.map((vaccination: any) => ({
        id: vaccination._id || vaccination.id,
        patient_id: vaccination.patient_id,
        patient_name: vaccination.patient_name,
        patient_age: vaccination.patient_age,
        vaccinations: vaccination.vaccinations || {},
        updated_at: vaccination.updated_at || new Date().toISOString(),
      }));

      // Update local storage
      const allVaccinations = await getVaccinations();
      const updatedVaccinations = [...allVaccinations];
      vaccinations.forEach(newVaccination => {
        const existingIndex = updatedVaccinations.findIndex(v => v.id === newVaccination.id);
        if (existingIndex !== -1) {
          updatedVaccinations[existingIndex] = newVaccination;
        } else {
          updatedVaccinations.push(newVaccination);
        }
      });
      await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(updatedVaccinations));

      return vaccinations;
    }

    // Fallback to local storage
    const vaccinations = await getVaccinations();
    return vaccinations.filter(v => v.patient_id === patientId);
  } catch (error) {
    console.error('Error getting vaccinations by patient id from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const vaccinations = await getVaccinations();
      return vaccinations.filter(v => v.patient_id === patientId);
    } catch (localError) {
      console.error('Error getting vaccinations from local storage:', localError);
      return [];
    }
  }
};

export const getVaccinationById = async (id: string): Promise<VaccinationRecord | null> => {
  try {
    const vaccinations = await getVaccinations();
    return vaccinations.find(v => v.id === id) || null;
  } catch (error) {
    console.error('Error getting vaccination by id:', error);
    return null;
  }
};

export const deleteVaccination = async (id: string): Promise<void> => {
  try {
    const vaccinations = await getVaccinations();
    const filtered = vaccinations.filter(v => v.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    throw error;
  }
};
