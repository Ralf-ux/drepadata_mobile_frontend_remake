import AsyncStorage from '@react-native-async-storage/async-storage';
import { patientAPI } from '../api';
import { PatientProfile, STORAGE_KEYS } from '../types';

export const savePatient = async (patient: PatientProfile): Promise<void> => {
  try {
    // Save to MongoDB Atlas via API
    const patientData = {
      nom: patient.nom,
      prenom: patient.prenom,
      sexe: patient.sexe,
      date_diagnostic: patient.date_diagnostic || patient.diagnostic_date,
      age_diagnostic: parseInt(patient.age_diagnostic || patient.age || '0'),
      circonstances_diagnostic: patient.circonstances_du_diagnostic,
      numero_identification_unique: patient.numero_identification_unique,
      rang_fratrie: patient.rang_dans_fratrie ? parseInt(patient.rang_dans_fratrie) : undefined,
      nb_enfants_drepanocytaires: patient.nombre_de_drepanocytaires_dans_fratrie ? parseInt(patient.nombre_de_drepanocytaires_dans_fratrie) : undefined,
      type_drepanocytose: patient.type_de_drepanocytose,
      antecedents_personnels: patient.autres_antecedents_medicaux,
      antecedents_familiaux: patient.antecedent_familiaux,
      groupe_sanguin_rhesus: patient.groupe_sanguin_rhesus,
      vaccins_naissance: patient.vaccins_naissance ? JSON.stringify(patient.vaccins_naissance) : undefined,
    };

    let response;
    // Check if it's a MongoDB ObjectId (24 hex characters)
    if (patient.id && patient.id.length === 24 && /^[0-9a-fA-F]{24}$/.test(patient.id)) {
      // Update existing patient
      response = await patientAPI.update(patient.id, patientData);
    } else {
      // Create new patient
      response = await patientAPI.create(patientData);
    }

    // Validate response structure
    if (!response || !response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    // Also save locally for offline access
    const patients = await getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);
    const updatedPatient = { 
      ...patient, 
      id: response.data._id || response.data.id || patient.id, 
      updated_at: new Date().toISOString() 
    };

    if (existingIndex !== -1) {
      patients[existingIndex] = updatedPatient;
    } else {
      patients.push(updatedPatient);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  } catch (error) {
    console.error('Error saving patient:', error);
    throw error;
  }
};

export const getPatients = async (): Promise<PatientProfile[]> => {
  try {
    // Try to fetch from API first
    const response = await patientAPI.getAll();
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const patients: PatientProfile[] = response.data.map((patient: any) => ({
        id: patient._id || patient.id,
        numero_identification_unique: patient.numero_identification_unique,
        nom: patient.nom,
        prenom: patient.prenom,
        sexe: patient.sexe,
        date_diagnostic: patient.date_diagnostic,
        age_diagnostic: patient.age_diagnostic?.toString(),
        circonstances_du_diagnostic: patient.circonstances_diagnostic,
        rang_dans_fratrie: patient.rang_fratrie?.toString(),
        nombre_de_drepanocytaires_dans_fratrie: patient.nb_enfants_drepanocytaires?.toString(),
        type_de_drepanocytose: patient.type_drepanocytose,
        antecedent_familiaux: patient.antecedents_familiaux,
        autres_antecedents_medicaux: patient.antecedents_personnels,
        allergies_connues: patient.allergies_connues,
        details_allergies: patient.details_allergies,
        groupe_sanguin_rhesus: patient.groupe_sanguin_rhesus,
        quartier: patient.quartier,
        lieu_dit: patient.lieu_dit,
        contact_urgence_nom: patient.contact_urgence_nom,
        contact_urgence_telephone: patient.contact_urgence_telephone,
        contact_urgence_relation: patient.contact_urgence_relation,
        telephone_patient: patient.telephone_patient,
        vit_avec_le_patient: patient.vit_avec_le_patient,
        lien_avec_patient: patient.lien_avec_patient,
        patient_refere: patient.patient_refere,
        patient_refere_de: patient.patient_refere_de,
        patient_refere_pour: patient.patient_refere_pour,
        appartient_a_groupe: patient.appartient_a_groupe,
        nom_du_groupe: patient.nom_du_groupe,
        region: patient.region,
        age: patient.age?.toString(),
        date_naissance: patient.date_naissance,
        vaccins_naissance: patient.vaccins_naissance ? JSON.parse(patient.vaccins_naissance) : {},
        created_at: patient.created_at || new Date().toISOString(),
        updated_at: patient.updated_at || new Date().toISOString(),
      }));

      // Save to local storage for offline access
      await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      return patients;
    }

    // Fallback to local storage if API fails
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting patients from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.error('Error getting patients from local storage:', localError);
      return [];
    }
  }
};

// Helper function to check if an ID is a UUID (36 characters with hyphens)
const isUUID = (id: string): boolean => {
  return id.length === 36 && id.includes('-');
};

// Helper function to check if an ID is a MongoDB ObjectId (24 hex characters)
const isMongoObjectId = (id: string): boolean => {
  return id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
};

export const getPatientById = async (id: string): Promise<PatientProfile | null> => {
  try {
    // If the ID is a UUID, try to find the patient in local storage
    // If the patient was previously synced with the API, they should have a MongoDB ObjectId
    if (isUUID(id)) {
      console.warn('UUID detected in patient ID, attempting to find patient in local storage');
      const patients = await getPatients();
      const patientWithUUID = patients.find(p => p.id === id);
      
      if (patientWithUUID) {
        // If the patient was synced with API, their ID should be a MongoDB ObjectId
        // But if we found them by UUID, it means they still have UUID as ID
        // This means they were created locally and never synced, or the local storage is outdated
        // Try to refresh all patients from API to get the correct ObjectIds
        console.warn('Patient found in local storage with UUID. This patient may not be synced with the API.');
        console.warn('Attempting to refresh patients from API to get correct ObjectIds...');
        
        // Try to refresh patients from API
        try {
          const refreshedPatients = await getPatients(); // This will fetch from API
          const refreshedPatient = refreshedPatients.find(p => 
            p.numero_identification_unique === patientWithUUID.numero_identification_unique
          );
          
          if (refreshedPatient && isMongoObjectId(refreshedPatient.id)) {
            // Found the patient with MongoDB ObjectId, use it
            console.log('Found patient with MongoDB ObjectId:', refreshedPatient.id);
            id = refreshedPatient.id;
          } else {
            // Patient not found in API, return local patient (API calls will fail)
            console.warn('Patient not found in API. Returning local patient. API calls for related data will fail.');
            return patientWithUUID;
          }
        } catch (refreshError) {
          console.error('Error refreshing patients from API:', refreshError);
          // Return local patient as fallback
          return patientWithUUID;
        }
      } else {
        // UUID not found in local storage, try API with UUID (will fail, but we'll handle it)
        console.warn('UUID not found in local storage, attempting API call (will likely fail)');
      }
    }

    // Try to fetch from API first (now with MongoDB ObjectId if UUID was converted)
    const response = await patientAPI.getById(id);
    if (response && response.success && response.data) {
      const patient = response.data;
      // Transform API data to match frontend format
      const patientProfile: PatientProfile = {
        id: patient._id || patient.id,
        numero_identification_unique: patient.numero_identification_unique,
        nom: patient.nom,
        prenom: patient.prenom,
        sexe: patient.sexe,
        date_diagnostic: patient.date_diagnostic,
        age_diagnostic: patient.age_diagnostic?.toString(),
        circonstances_du_diagnostic: patient.circonstances_diagnostic,
        rang_dans_fratrie: patient.rang_fratrie?.toString(),
        nombre_de_drepanocytaires_dans_fratrie: patient.nb_enfants_drepanocytaires?.toString(),
        type_de_drepanocytose: patient.type_drepanocytose,
        antecedent_familiaux: patient.antecedents_familiaux,
        autres_antecedents_medicaux: patient.antecedents_personnels,
        allergies_connues: patient.allergies_connues || false,
        details_allergies: patient.details_allergies || '',
        groupe_sanguin_rhesus: patient.groupe_sanguin_rhesus,
        quartier: patient.quartier || '',
        lieu_dit: patient.lieu_dit || '',
        contact_urgence_nom: patient.contact_urgence_nom || '',
        contact_urgence_telephone: patient.contact_urgence_telephone || '',
        contact_urgence_relation: patient.contact_urgence_relation || '',
        telephone_patient: patient.telephone_patient || '',
        vit_avec_le_patient: patient.vit_avec_le_patient || false,
        lien_avec_patient: patient.lien_avec_patient || '',
        patient_refere: patient.patient_refere || false,
        patient_refere_de: patient.patient_refere_de || '',
        patient_refere_pour: patient.patient_refere_pour || '',
        appartient_a_groupe: patient.appartient_a_groupe || false,
        nom_du_groupe: patient.nom_du_groupe || '',
        region: patient.region || '',
        age: patient.age?.toString() || '',
        date_naissance: patient.date_naissance || '',
        vaccins_naissance: patient.vaccins_naissance ? JSON.parse(patient.vaccins_naissance) : {},
        assurance: patient.assurance || '',
        // Additional consultation fields with defaults
        fosa: '',
        fosa_other: '',
        district: '',
        diagnostic_date: patient.date_diagnostic || '',
        ipp: '',
        personnel: '',
        personnel_remplissant: '',
        poids: '',
        taille: '',
        referred: '',
        referred_from: '',
        referred_from_other: '',
        referred_for: '',
        address: '',
        patient_phone_number: patient.telephone_patient || '',
        lives_with: '',
        insurance_other: '',
        support_group: '',
        group_name: patient.nom_du_groupe || '',
        appartient_groupe: patient.appartient_a_groupe ? 'Oui' : 'Non',
        nom_groupe_association: patient.nom_du_groupe || '',
        parents: '',
        sibling_rank: patient.rang_fratrie?.toString() || '',
        sickle_type: patient.type_drepanocytose || '',
        diagnosis_age: patient.age_diagnostic?.toString() || '',
        diagnosis_circumstance: patient.circonstances_diagnostic || '',
        family_history: patient.antecedents_familiaux || '',
        other_medical_history: patient.antecedents_personnels || '',
        other_medical_history_details: '',
        previous_surgeries: '',
        interventions_chirurgicales_anterieures: '',
        date_derniere_intervention: '',
        cause_derniere_intervention: '',
        acide_folique_step3: '',
        nombre_crises_vaso: '',
        allergies: patient.details_allergies || '',
        allergies_details: patient.details_allergies || '',
        created_at: patient.created_at || new Date().toISOString(),
        updated_at: patient.updated_at || new Date().toISOString(),
      };

      // Update local storage
      const patients = await getPatients();
      const existingIndex = patients.findIndex(p => p.id === id);
      if (existingIndex !== -1) {
        patients[existingIndex] = patientProfile;
      } else {
        patients.push(patientProfile);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));

      return patientProfile;
    }

    // Fallback to local storage
    const patients = await getPatients();
    return patients.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting patient by id from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const patients = await getPatients();
      return patients.find(p => p.id === id) || null;
    } catch (localError) {
      console.error('Error getting patient from local storage:', localError);
      return null;
    }
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  try {
    const patients = await getPatients();
    const filtered = patients.filter(p => p.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};

export const searchPatients = async (query: string): Promise<PatientProfile[]> => {
  try {
    const patients = await getPatients();
    const lowerQuery = query.toLowerCase();
    
    return patients.filter(p => 
      p.nom.toLowerCase().includes(lowerQuery) ||
      p.prenom.toLowerCase().includes(lowerQuery) ||
      p.numero_identification_unique.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
};

