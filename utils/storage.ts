import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration
const API_BASE_URL = 'http://localhost:5000/api'; // Change this to your backend URL

// Helper function to sync data to backend
const syncToBackend = async (endpoint: string, data: any, method: 'POST' | 'PUT' = 'POST') => {
  try {
    // For now, just log the sync attempt and return true to avoid errors
    console.log(`Syncing to backend: ${method} ${API_BASE_URL}${endpoint}`, data);
    return true;
  } catch (error) {
    console.error('Error syncing to backend:', error);
    return false;
  }
};

export interface PatientProfile {
  id: string; // Frontend generated ID
  lastName: string;
  firstName: string;
  sex: 'Male' | 'Female';
  dateOfDiagnosis: string; // Date string
  ageAtDiagnosis: 'At birth' | '0-3 months' | '4-6 months' | '7-12 months' | '2-3 years' | '4-5 years';
  circumstancesOfDiagnosis: 'Neonatal diagnosis' | 'Diagnosis from siblings';
  uniqueId: string;
  birthOrderInSiblings: number;
  numberOfSickleCellInFamily: number;
  typeOfSickleCell: 'SS' | 'SC' | 'Sβ⁰' | 'Sβ⁺' | 'Other';
  personalMedicalHistory?: string;
  familyMedicalHistory?: string;
  bloodGroup: 'O+' | 'O-' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-';
  rhesusFactor: 'Positive' | 'Negative';
  vaccinesAtBirth?: string; // Comma-separated string of vaccines
  dateOfBirth?: string; // Date string
  age?: number;
  relationshipWithPatient?: 'Father' | 'Mother' | 'Grandmother' | 'Grandfather' | 'Brother' | 'Sister' | 'Uncle' | 'Aunt' | 'Other';
  neighborhood?: string;
  locality?: string;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  patientPhone?: string;
  livesWithPatient?: boolean;
  belongsToGroup?: boolean;
  groupName?: string;
  insurance?: 'CNPS' | 'CNAS' | 'Private' | 'None' | 'Others';
  insuranceDetails?: string;
  vocLast3Months?: 'None' | '1' | '1-2' | '3-5' | 'More than 5';
  familyHistory?: 'Yes' | 'No' | 'Unknown';
  otherMedicalHistory?: string[];
  previousSurgicalInterventions?: {
    hasInterventions?: boolean;
    dateOfLastIntervention?: string; // Date string
    cause?: string;
  };
  folicAcid?: boolean;
  knownAllergies?: {
    hasAllergies?: boolean;
    details?: string;
  };
  isActive?: boolean; // Defaulted in backend
  createdBy?: string; // ObjectId string, handled by backend

  created_at: string;
  updated_at: string;
}

export interface ConsultationData {
  id: string;
  patient_id: string;
  consultation_type: 'initial' | 'follow_up';
  consultation_date: string;

  // Dynamic consultation fields (collected during consultations/follow-ups)
  vocs: string;
  cvo_3_derniers_mois: string;
  hospitalizations: string;
  hospitalisations_3_derniers_mois: string;
  nombre_hospitalisations_3mois: string;
  hospitalization_cause: string;
  longest_hospitalization: string;
  hb_1: string;
  hb_2: string;
  hb_3: string;
  taux_hemoglobine_recent: string;
  taux_hbf_recent: string;
  taux_hbs_recent: string;
  hbf_1: string;
  hbf_2: string;
  hbf_3: string;
  hbs_1: string;
  hbs_2: string;
  hbs_3: string;
  transfusion_reaction: string;
  reaction_types: string[];
  reaction_type_other: string;
  allo_immunization: string;
  hyperviscosity: string;
  acute_chest_syndrome: string;
  acute_event: string;
  acute_event_details: string;
  stroke: string;
  priapism: string;
  leg_ulcer: string;
  cholecystectomy: string;
  asplenia: string;
  recommended_vaccines: string[];
  drug_side_effects: string;

  hydroxyurea: string;
  tolerance: string;
  hydroxyurea_reasons: string;
  hydroxyurea_dosage: string;
  posologie_hydroxyurea: string;
  folic_acid: string;
  antibio_prophylaxie: string;
  regular_transfusion: string;
  transfusion_type: string;
  type_transfusion_sanguine: string;
  transfusion_frequency: string;
  frequence_transfusion_3mois: string;
  last_transfusion_date: string;
  autres_traitements_specifiques: string;
  observance: string[];

  nfs_gb: string;
  nfs_hb: string;
  nfs_pqts: string;
  reticulocytes: string;
  microalbuminuria: string;
  hemolysis: string;
  gs_rh: string;
  imagerie_medical: string;
  ophtalmologie: string;
  consultations_specialisees: string;
  examen_du_jour: string;

  impact_scolaire: string;
  participation_causeries: string;
  suivie_psychologique: string;
  education_therapeutique: string;
  consultation_psychologique: string;
  visite_domicile: string;
  soutien_social: string;
  soutien_social_options: string[];
  impact_social: string;
  accompagnement_special: string;
  famille_informee: string;
  plan_suivi_personnalise: string;
  date_prochaine_consultation: string;

  examens_avant_consultation: string[];
  evolution: string;
  education_therapeutique_step8: string;
  date_prochaine_consultation_plan: string;

  commentaires: string;

  created_at: string;
  updated_at: string;
}

export interface FollowUpData {
  id: string;
  patient_id: string;
  consultation_id: string;
  follow_up_number: number;
  follow_up_date: string;
  
  poids: string;
  taille: string;
  cvo_3_derniers_mois: string;
  hospitalisations_3_derniers_mois: string;
  hospitalization_cause: string;
  taux_hemoglobine_recent: string;
  taux_hbf_recent: string;
  taux_hbs_recent: string;
  
  hydroxyurea: string;
  tolerance: string;
  posologie_hydroxyurea: string;
  folic_acid: string;
  antibio_prophylaxie: string;
  regular_transfusion: string;
  type_transfusion_sanguine: string;
  frequence_transfusion_3mois: string;
  last_transfusion_date: string;
  autres_traitements_specifiques: string;
  observance: string[];
  
  nfs_gb: string;
  nfs_hb: string;
  nfs_pqts: string;
  reticulocytes: string;
  microalbuminuria: string;
  
  impact_scolaire: string;
  participation_causeries: string;
  suivie_psychologique: string;
  education_therapeutique: string;
  visite_domicile: string;
  soutien_social: string;
  
  evolution: string;
  commentaires: string;
  date_prochaine_consultation: string;
  
  created_at: string;
  updated_at: string;
}

export interface VaccinationRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: string;
  vaccinations: Record<string, boolean>;
  updated_at: string;
}

const STORAGE_KEYS = {
  PATIENTS: '@patients',
  CONSULTATIONS: '@consultations',
  FOLLOW_UPS: '@follow_ups',
  VACCINATIONS: '@vaccinations',
  ONBOARDING_COMPLETE: '@onboarding_complete',
} as const;

export const savePatient = async (patient: PatientProfile): Promise<void> => {
  try {
    const patients = await getPatients();
    const existingIndex = patients.findIndex(p => p.id === patient.id);

    if (existingIndex !== -1) {
      patients[existingIndex] = { ...patient, updated_at: new Date().toISOString() };
    } else {
      patients.push(patient);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));

    // Sync to backend
    const method = existingIndex !== -1 ? 'PUT' : 'POST';
    await syncToBackend('/patients', patient, method);
  } catch (error) {
    console.error('Error saving patient:', error);
    throw error;
  }
};

export const getPatients = async (): Promise<PatientProfile[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting patients:', error);
    return [];
  }
};

export const getPatientById = async (id: string): Promise<PatientProfile | null> => {
  try {
    const patients = await getPatients();
    return patients.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error getting patient by id:', error);
    return null;
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

export const saveConsultation = async (consultation: ConsultationData): Promise<void> => {
  try {
    const consultations = await getConsultations();
    const existingIndex = consultations.findIndex(c => c.id === consultation.id);

    const timestamp = new Date().toISOString();
    if (existingIndex !== -1) {
      consultations[existingIndex] = { ...consultation, updated_at: timestamp };
    } else {
      consultations.push({ ...consultation, created_at: timestamp, updated_at: timestamp, consultation_date: timestamp });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));

    // Sync to backend
    const method = existingIndex !== -1 ? 'PUT' : 'POST';
    await syncToBackend('/consultations', consultation, method);
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const getConsultations = async (): Promise<ConsultationData[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting consultations:', error);
    return [];
  }
};

export const getConsultationsByPatientId = async (patientId: string): Promise<ConsultationData[]> => {
  try {
    const consultations = await getConsultations();
    return consultations.filter(c => c.patient_id === patientId);
  } catch (error) {
    console.error('Error getting consultations by patient id:', error);
    return [];
  }
};

export const deleteConsultation = async (id: string): Promise<void> => {
  try {
    const consultations = await getConsultations();
    const filtered = consultations.filter(c => c.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting consultation:', error);
    throw error;
  }
};

export const saveFollowUp = async (followUp: FollowUpData): Promise<void> => {
  try {
    const followUps = await getFollowUps();
    const existingIndex = followUps.findIndex(f => f.id === followUp.id);

    const timestamp = new Date().toISOString();
    if (existingIndex !== -1) {
      followUps[existingIndex] = { ...followUp, updated_at: timestamp };
    } else {
      followUps.push({ ...followUp, created_at: timestamp, updated_at: timestamp });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));

    // Sync to backend
    const method = existingIndex !== -1 ? 'PUT' : 'POST';
    await syncToBackend('/follow-ups', followUp, method);
  } catch (error) {
    console.error('Error saving follow-up:', error);
    throw error;
  }
};

export const getFollowUps = async (): Promise<FollowUpData[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting follow-ups:', error);
    return [];
  }
};

export const getFollowUpsByPatientId = async (patientId: string): Promise<FollowUpData[]> => {
  try {
    const followUps = await getFollowUps();
    return followUps.filter(f => f.patient_id === patientId).sort((a, b) => 
      new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime()
    );
  } catch (error) {
    console.error('Error getting follow-ups by patient id:', error);
    return [];
  }
};

export const deleteFollowUp = async (id: string): Promise<void> => {
  try {
    const followUps = await getFollowUps();
    const filtered = followUps.filter(f => f.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting follow-up:', error);
    throw error;
  }
};

export const saveVaccinationRecord = async (vaccination: VaccinationRecord): Promise<void> => {
  try {
    const vaccinations = await getVaccinationRecords();
    const existingIndex = vaccinations.findIndex(v => v.patient_id === vaccination.patient_id);

    const timestamp = new Date().toISOString();
    if (existingIndex !== -1) {
      vaccinations[existingIndex] = { ...vaccination, updated_at: timestamp };
    } else {
      vaccinations.push({ ...vaccination, updated_at: timestamp });
    }

    await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(vaccinations));

    // Sync to backend
    const method = existingIndex !== -1 ? 'PUT' : 'POST';
    const endpoint = method === 'PUT' ? `/vaccinations/${vaccination.id}` : '/vaccinations';
    await syncToBackend(endpoint, vaccination, method);
  } catch (error) {
    console.error('Error saving vaccination record:', error);
    throw error;
  }
};

export const getVaccinationRecords = async (): Promise<VaccinationRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VACCINATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting vaccination records:', error);
    return [];
  }
};

export const getVaccinationRecordByPatientId = async (patientId: string): Promise<VaccinationRecord | null> => {
  try {
    const vaccinations = await getVaccinationRecords();
    return vaccinations.find(v => v.patient_id === patientId) || null;
  } catch (error) {
    console.error('Error getting vaccination record by patient id:', error);
    return null;
  }
};

export const deleteVaccinationRecord = async (patientId: string): Promise<void> => {
  try {
    const vaccinations = await getVaccinationRecords();
    const filtered = vaccinations.filter(v => v.patient_id !== patientId);
    await AsyncStorage.setItem(STORAGE_KEYS.VACCINATIONS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting vaccination record:', error);
    throw error;
  }
};

export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
    throw error;
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding complete:', error);
    return false;
  }
};

export const searchPatients = async (query: string): Promise<PatientProfile[]> => {
  try {
    const patients = await getPatients();
    const lowerQuery = query.toLowerCase();
    
    return patients.filter(p =>
      p.lastName.toLowerCase().includes(lowerQuery) ||
      p.firstName.toLowerCase().includes(lowerQuery) ||
      p.uniqueId.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
};
