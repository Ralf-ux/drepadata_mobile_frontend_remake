// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isAuthenticated } from '@/utils/authUtils';
import { getPatients as getPatientsFromApi } from '@/api/users';

// ──────────────────────────────────────────────────────────────
// Backend configuration
// ──────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://localhost:5000/api'; // <-- change when you have a real server

const syncToBackend = async (
  endpoint: string,
  data: any,
  method: 'POST' | 'PUT' = 'POST'
): Promise<boolean> => {
  try {
    console.log(`Sync → ${method} ${API_BASE_URL}${endpoint}`, data);
    // TODO: real fetch when backend is ready
    // const res = await fetch(`${API_BASE_URL}${endpoint}`, { method, body: JSON.stringify(data), headers:{'Content-Type':'application/json'} });
    // return res.ok;
    return true;
  } catch (e) {
    console.error('Sync error', e);
    return false;
  }
};

// ──────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────
export interface PatientProfile {
  id: string;
  nom: string;
  prenom: string;
  sexe: 'Male' | 'Female' | 'Masculin' | 'Féminin';
  date_naissance?: string;
  age_diagnostic?:
    | 'At birth'
    | '0-3 months'
    | '4-6 months'
    | '7-12 months'
    | '2-3 years'
    | '4-5 years';
  circonstances_du_diagnostic?: 'Neonatal diagnosis' | 'Diagnosis from siblings';
  numero_identification_unique: string;
  rang_dans_fratrie?: number;
  nombre_de_drepanocytaires_dans_fratrie?: number;
  type_de_drepanocytose: 'SS' | 'SC' | 'Sβ⁰' | 'Sβ⁺' | 'Other';
  groupe_sanguin_rhesus?: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  telephone_patient?: string;
  quartier?: string;
  lieu_dit?: string;
  region?: string;
  contact_urgence_nom?: string;
  contact_urgence_relation?: string;
  contact_urgence_telephone?: string;
  vit_avec_le_patient?: boolean;
  appartient_a_groupe?: boolean;
  nom_du_groupe?: string;
  assurance?: 'CNPS' | 'CNAS' | 'Private' | 'None' | 'Others';
  assurance_details?: string;
  patient_refere?: boolean;
  patient_refere_de?: string;
  patient_refere_pour?: string;
  antecedent_familiaux?: string;
  autres_antecedents_medicaux?: string;
  allergies_connues?: boolean;
  details_allergies?: string;
  age?: number;
  createdBy?: string;
  isActive?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsultationData {
  id: string;
  patient_id: string;
  consultation_date: string;
  consultation_type?: string;
  created_at: string;
  updated_at: string;
  cvo_3_derniers_mois?: string;
  hospitalisations_3_derniers_mois?: string;
  hospitalization_cause?: string;
  longest_hospitalization?: string;
  taux_hemoglobine_recent?: number;
  taux_hbf_recent?: number;
  taux_hbs_recent?: number;
  reticulocytes?: number;
  nfs_gb?: number;
  nfs_pqts?: number;
  hydroxyurea?: boolean;
  tolerance?: string;
  posologie_hydroxyurea?: string;
  hydroxyurea_reasons?: string;
  folic_acid?: boolean;
  antibio_prophylaxie?: boolean;
  regular_transfusion?: boolean;
  type_transfusion_sanguine?: string;
  frequence_transfusion_3mois?: string;
  last_transfusion_date?: string;
  autres_traitements_specifiques?: string;
  observance?: string;
  impact_scolaire?: string;
  participation_causeries?: boolean;
  suivie_psychologique?: boolean;
  education_therapeutique?: boolean;
  visite_domicile?: boolean;
  soutien_social?: boolean;
  evolution?: string;
  date_prochaine_consultation_plan?: string;
  examens_avant_consultation?: any[];
  commentaires?: string;
}

export interface FollowUpData {
  id: string;
  patient_id: string;
  follow_up_date: string;
  follow_up_number?: number;
  created_at: string;
  updated_at: string;
  poids?: number;
  taille?: number;
  cvo_3_derniers_mois?: string;
  hospitalisations_3_derniers_mois?: string;
  hospitalization_cause?: string;
  taux_hemoglobine_recent?: number;
  taux_hbf_recent?: number;
  taux_hbs_recent?: number;
  nfs_gb?: number;
  nfs_hb?: number;
  nfs_pqts?: number;
  reticulocytes?: number;
  microalbuminuria?: boolean;
  hydroxyurea?: boolean;
  tolerance?: string;
  posologie_hydroxyurea?: string;
  folic_acid?: boolean;
  antibio_prophylaxie?: boolean;
  regular_transfusion?: boolean;
  type_transfusion_sanguine?: string;
  frequence_transfusion_3mois?: string;
  last_transfusion_date?: string;
  autres_traitements_specifiques?: string;
  observance?: string;
  impact_scolaire?: string;
  participation_causeries?: boolean;
  suivie_psychologique?: boolean;
  education_therapeutique?: boolean;
  visite_domicile?: boolean;
  soutien_social?: boolean;
  evolution?: string;
  commentaires?: string;
  date_prochaine_consultation?: string;
  priority?: string;
}

export interface VaccinationRecord {
  id: string;
  patient_id: string;
  vaccinations: {
    [key: string]: boolean;
  };
  created_at: string;
  updated_at: string;
  patient_name?: string;
  patient_age?: number;
}

// ──────────────────────────────────────────────────────────────
// Keys
// ──────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  PATIENTS: '@patients',
  CONSULTATIONS: '@consultations',
  FOLLOW_UPS: '@follow_ups',
  VACCINATIONS: '@vaccinations',
  ONBOARDING_COMPLETE: '@onboarding_complete',
} as const;

// ──────────────────────────────────────────────────────────────
// PATIENTS
// ──────────────────────────────────────────────────────────────
export const savePatient = async (patient: PatientProfile): Promise<void> => {
  const patients = await getPatients();
  const idx = patients.findIndex(p => p.id === patient.id);

  if (idx > -1) {
    // Use updatePatient for existing patients
    await updatePatient(patient.id, patient);
  } else {
    patients.push(patient);
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    
    // Try to sync with backend
    try {
      const { createPatient } = await import('@/api/users');
      // Transform patient data to backend format
      const backendPatient = transformToFrontendPatient(patient);
      await createPatient(backendPatient);
      console.log('Patient successfully synced with backend');
    } catch (error) {
      console.log('Backend sync failed, patient saved locally:', error);
    }
  }
};

// Initialize with sample patients if none exist
export const initializeSamplePatients = async (): Promise<void> => {
  const patients = await getPatients();
  if (patients.length === 0) {
    const samplePatients: PatientProfile[] = [
      {
        id: '1',
        nom: 'Doe',
        prenom: 'John',
        sexe: 'Male',
        numero_identification_unique: 'P123456',
        type_de_drepanocytose: 'SS',
        groupe_sanguin_rhesus: 'O+',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        nom: 'Smith',
        prenom: 'Jane',
        sexe: 'Female',
        numero_identification_unique: 'P789012',
        type_de_drepanocytose: 'SC',
        groupe_sanguin_rhesus: 'A-',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(samplePatients));
    console.log('Initialized with', samplePatients.length, 'sample patients');
  }
};

// Transform backend patient data to frontend format
const transformBackendPatient = (backendPatient: any): PatientProfile => {
  console.log('Transforming patient:', backendPatient);
  
  return {
    id: backendPatient._id || backendPatient.id,
    nom: backendPatient.lastName || backendPatient.nom || '',
    prenom: backendPatient.firstName || backendPatient.prenom || '',
    sexe: backendPatient.sex || backendPatient.sexe || 'Male',
    date_naissance: backendPatient.dateOfBirth || backendPatient.date_naissance,
    age_diagnostic: backendPatient.ageAtDiagnosis || backendPatient.age_diagnostic,
    circonstances_du_diagnostic: backendPatient.circumstancesOfDiagnosis || backendPatient.circonstances_du_diagnostic,
    numero_identification_unique: backendPatient.uniqueId || backendPatient.numero_identification_unique || '',
    rang_dans_fratrie: backendPatient.birthOrderInSiblings,
    nombre_de_drepanocytaires_dans_fratrie: backendPatient.numberOfSickleCellInFamily,
    type_de_drepanocytose: backendPatient.typeOfSickleCell || backendPatient.type_de_drepanocytose || 'SS',
    groupe_sanguin_rhesus: backendPatient.bloodGroup || backendPatient.groupe_sanguin_rhesus,
    telephone_patient: backendPatient.patientPhone || backendPatient.telephone_patient,
    quartier: backendPatient.neighborhood || backendPatient.quartier,
    lieu_dit: backendPatient.locality || backendPatient.lieu_dit,
    region: backendPatient.region,
    contact_urgence_nom: backendPatient.emergencyContact?.name || backendPatient.contact_urgence_nom,
    contact_urgence_relation: backendPatient.emergencyContact?.relation || backendPatient.contact_urgence_relation,
    contact_urgence_telephone: backendPatient.emergencyContact?.phone || backendPatient.contact_urgence_telephone,
    vit_avec_le_patient: backendPatient.emergencyContact?.livesWithPatient || backendPatient.vit_avec_le_patient,
    appartient_a_groupe: backendPatient.belongsToGroup || backendPatient.appartient_a_groupe,
    nom_du_groupe: backendPatient.groupName || backendPatient.nom_du_groupe,
    assurance: backendPatient.insurance || backendPatient.assurance,
    assurance_details: backendPatient.insuranceDetails || backendPatient.assurance_details,
    patient_refere: backendPatient.patient_refere || false,
    patient_refere_de: backendPatient.patient_refere_de,
    patient_refere_pour: backendPatient.patient_refere_pour,
    antecedent_familiaux: backendPatient.familyHistory || backendPatient.antecedent_familiaux,
    autres_antecedents_medicaux: backendPatient.personalMedicalHistory || backendPatient.autres_antecedents_medicaux,
    allergies_connues: backendPatient.knownAllergies?.hasAllergies || backendPatient.allergies_connues,
    details_allergies: backendPatient.knownAllergies?.details || backendPatient.details_allergies,
    age: backendPatient.age,
    createdBy: backendPatient.createdBy,
    isActive: backendPatient.isActive,
    created_at: backendPatient.createdAt || backendPatient.created_at,
    updated_at: backendPatient.updatedAt || backendPatient.updated_at,
  };
};

export const getPatients = async (): Promise<PatientProfile[]> => {
  try {
    // First try to get patients from the backend
    console.log('getPatients: Attempting to fetch from backend...');
    const backendResponse = await getPatientsFromApi();
    console.log('getPatients: Backend response:', backendResponse);
    
    // Handle the response format { patients: [...] }
    const backendPatients = backendResponse?.patients || backendResponse;
    
    if (backendPatients && Array.isArray(backendPatients) && backendPatients.length > 0) {
      // Transform backend data to frontend format
      const transformedPatients = backendPatients.map(transformBackendPatient);
      console.log('getPatients: Transformed patients:', transformedPatients);
      
      // Save to local storage for offline access
      await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(transformedPatients));
      console.log('getPatients: Saved', transformedPatients.length, 'patients to local storage');
      return transformedPatients;
    } else {
      console.log('getPatients: No patients found in backend or invalid response');
    }
  } catch (error) {
    console.log('getPatients: Backend fetch failed, using local storage:', error);
    // Fall back to local storage if backend fails
  }
  
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
  const localPatients = raw ? JSON.parse(raw) : [];
  console.log('getPatients: Returning', localPatients.length, 'patients from local storage');
  return localPatients;
};

export const getPatientById = async (id: string): Promise<PatientProfile | null> => {
  const all = await getPatients();
  return all.find(p => p.id === id) ?? null;
};

export const updatePatient = async (id: string, patientData: Partial<PatientProfile>): Promise<void> => {
  const all = await getPatients();
  const idx = all.findIndex(p => p.id === id);
  
  if (idx > -1) {
    const updatedPatient = { ...all[idx], ...patientData, updated_at: new Date().toISOString() };
    all[idx] = updatedPatient;
    
    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(all));
    
    // Try to sync with backend
    try {
      const { updatePatient: updatePatientApi } = await import('@/api/users');
      // Transform patient data to backend format
      const backendPatient = transformToFrontendPatient(updatedPatient);
      await updatePatientApi(id, backendPatient);
      console.log('Patient successfully updated in backend');
    } catch (error) {
      console.log('Backend update failed, patient updated locally:', error);
    }
  } else {
    throw new Error(`Patient with ID ${id} not found`);
  }
};

export const deletePatient = async (id: string): Promise<void> => {
  const all = await getPatients();
  const idx = all.findIndex(p => p.id === id);
  
  if (idx > -1) {
    // Try to delete from backend first
    try {
      const { deletePatient: deletePatientApi } = await import('@/api/users');
      await deletePatientApi(id);
      console.log('Patient successfully deleted from backend');
    } catch (error) {
      console.log('Backend delete failed, patient deleted locally:', error);
      // Continue with local deletion even if backend fails
    }
    
    // Delete from local storage
    await AsyncStorage.setItem(
      STORAGE_KEYS.PATIENTS,
      JSON.stringify(all.filter(p => p.id !== id))
    );
  } else {
    throw new Error(`Patient with ID ${id} not found`);
  }
};

// Transform frontend patient data to backend format
const transformToFrontendPatient = (frontendPatient: PatientProfile): any => {
  return {
    lastName: frontendPatient.nom,
    firstName: frontendPatient.prenom,
    sex: frontendPatient.sexe,
    dateOfBirth: frontendPatient.date_naissance,
    ageAtDiagnosis: frontendPatient.age_diagnostic,
    circumstancesOfDiagnosis: frontendPatient.circonstances_du_diagnostic,
    uniqueId: frontendPatient.numero_identification_unique,
    birthOrderInSiblings: frontendPatient.rang_dans_fratrie,
    numberOfSickleCellInFamily: frontendPatient.nombre_de_drepanocytaires_dans_fratrie,
    typeOfSickleCell: frontendPatient.type_de_drepanocytose,
    bloodGroup: frontendPatient.groupe_sanguin_rhesus,
    patientPhone: frontendPatient.telephone_patient,
    neighborhood: frontendPatient.quartier,
    locality: frontendPatient.lieu_dit,
    region: frontendPatient.region,
    emergencyContact: {
      name: frontendPatient.contact_urgence_nom,
      relation: frontendPatient.contact_urgence_relation,
      phone: frontendPatient.contact_urgence_telephone,
      livesWithPatient: frontendPatient.vit_avec_le_patient,
    },
    belongsToGroup: frontendPatient.appartient_a_groupe,
    groupName: frontendPatient.nom_du_groupe,
    insurance: frontendPatient.assurance,
    insuranceDetails: frontendPatient.assurance_details,
    familyHistory: frontendPatient.antecedent_familiaux,
    personalMedicalHistory: frontendPatient.autres_antecedents_medicaux,
    knownAllergies: {
      hasAllergies: frontendPatient.allergies_connues,
      details: frontendPatient.details_allergies,
    },
    age: frontendPatient.age,
    createdBy: frontendPatient.createdBy,
    isActive: frontendPatient.isActive,
  };
};

// ──────────────────────────────────────────────────────────────
// CONSULTATIONS
// ──────────────────────────────────────────────────────────────
export const saveConsultation = async (c: ConsultationData): Promise<void> => {
  const all = await getConsultations();
  const idx = all.findIndex(x => x.id === c.id);
  const ts = new Date().toISOString();

  if (idx > -1) {
    all[idx] = { ...c, updated_at: ts };
  } else {
    all.push({ ...c, created_at: ts, updated_at: ts });
  }

  await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(all));
  const method = idx > -1 ? 'PUT' : 'POST';
  await syncToBackend('/consultations', c, method);
};

export const getConsultations = async (): Promise<ConsultationData[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
  return raw ? JSON.parse(raw) : [];
};

export const getConsultationsByPatientId = async (patientId: string) => {
  const all = await getConsultations();
  return all.filter(c => c.patient_id === patientId);
};

export const deleteConsultation = async (id: string) => {
  const all = await getConsultations();
  await AsyncStorage.setItem(
    STORAGE_KEYS.CONSULTATIONS,
    JSON.stringify(all.filter(c => c.id !== id))
  );
};

// ──────────────────────────────────────────────────────────────
// FOLLOW-UPS
// ──────────────────────────────────────────────────────────────
export const saveFollowUp = async (f: FollowUpData): Promise<void> => {
  const all = await getFollowUps();
  const idx = all.findIndex(x => x.id === f.id);
  const ts = new Date().toISOString();

  if (idx > -1) {
    all[idx] = { ...f, updated_at: ts };
  } else {
    all.push({ ...f, created_at: ts, updated_at: ts });
  }

  await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(all));
  const method = idx > -1 ? 'PUT' : 'POST';
  await syncToBackend('/follow-ups', f, method);
};

export const getFollowUps = async (): Promise<FollowUpData[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
  return raw ? JSON.parse(raw) : [];
};

export const getFollowUpsByPatientId = async (patientId: string) => {
  const all = await getFollowUps();
  return all
    .filter(f => f.patient_id === patientId)
    .sort((a, b) => new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime());
};

export const deleteFollowUp = async (id: string) => {
  const all = await getFollowUps();
  await AsyncStorage.setItem(
    STORAGE_KEYS.FOLLOW_UPS,
    JSON.stringify(all.filter(f => f.id !== id))
  );
};

// ──────────────────────────────────────────────────────────────
// VACCINATIONS
// ──────────────────────────────────────────────────────────────
export const saveVaccinationRecord = async (v: VaccinationRecord): Promise<void> => {
  const all = await getVaccinationRecords();
  const idx = all.findIndex(x => x.patient_id === v.patient_id);
  const ts = new Date().toISOString();

  if (idx > -1) {
    all[idx] = { ...v, updated_at: ts };
  } else {
    all.push({ ...v, updated_at: ts });
  }

  await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(all));
  const method = idx > -1 ? 'PUT' : 'POST';
  const endpoint = method === 'PUT' ? `/vaccinations/${v.id}` : '/vaccinations';
  await syncToBackend(endpoint, v, method);
};

export const getVaccinationRecords = async (): Promise<VaccinationRecord[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
  return raw ? JSON.parse(raw) : [];
};

export const getVaccinationRecordByPatientId = async (patientId: string) => {
  const all = await getVaccinationRecords();
  return all.find(v => v.patient_id === patientId) ?? null;
};

export const deleteVaccinationRecord = async (patientId: string) => {
  const all = await getVaccinationRecords();
  await AsyncStorage.setItem(
    STORAGE_KEYS.VACCINATIONS,
    JSON.stringify(all.filter(v => v.patient_id !== patientId))
  );
};

// ──────────────────────────────────────────────────────────────
// ONBOARDING
// ──────────────────────────────────────────────────────────────
export const setOnboardingComplete = async (): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  const val = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
  return val === 'true';
};

// ──────────────────────────────────────────────────────────────
// SEARCH
// ──────────────────────────────────────────────────────────────
export const searchPatients = async (query: string): Promise<PatientProfile[]> => {
  const all = await getPatients();
  const q = query.toLowerCase();
  return all.filter(
    p =>
      p.nom.toLowerCase().includes(q) ||
      p.prenom.toLowerCase().includes(q) ||
      p.numero_identification_unique.toLowerCase().includes(q)
  );
};