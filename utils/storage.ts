import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PatientIdentity {
  id: string;
  nom: string;
  prenom: string;
  sexe: string;
  date_diagnostic: string;
  age_diagnostic: number;
  circonstances_diagnostic: string;
  numero_identification_unique: string;
  rang_fratrie: number;
  nb_enfants_drepanocytaires: number;
  type_drepanocytose: string;
  antecedents_personnels: string;
  antecedents_familiaux: string;
  groupe_sanguin_rhesus: string;
  vaccins_naissance: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationData {
  id: string;
  patient_id: string;
  consultation_type: 'initial' | 'follow_up';
  // Step 1
  fosa: string;
  fosa_other: string;
  region: string;
  district: string;
  diagnostic_date: string;
  ipp: string;
  personnel: string;
  personnel_remplissant: string;
  poids: string;
  taille: string;
  referred: string;
  referred_from: string;
  referred_from_other: string;
  referred_for: string;

  // Step 2
  full_name: string;
  age: string;
  birth_date: string;
  sex: string;
  quartier: string;
  lieu_dit: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_phone: string;
  patient_phone: string;
  patient_phone_number: string;
  lives_with: string;
  vit_avec_patient: string;
  lien_avec_patient: string;
  insurance: string;
  insurance_other: string;
  support_group: string;
  group_name: string;
  appartient_groupe: string;
  nom_groupe_association: string;
  parents: string;
  sibling_rank: string;
  rang_fratrie: string;
  nombre_drepanocytaire_fratrie: string;

  // Step 3
  sickle_type: string;
  diagnosis_age: string;
  diagnosis_circumstance: string;
  family_history: string;
  other_medical_history: string;
  autres_antecedents_medicaux: string;
  other_medical_history_details: string;
  previous_surgeries: string;
  interventions_chirurgicales_anterieures: string;
  date_derniere_intervention: string;
  cause_derniere_intervention: string;
  acide_folique_step3: string;
  nombre_crises_vaso: string;
  allergies: string;
  allergies_details: string;

  // Step 4
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

  // Step 5
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

  // Step 6
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

  // Step 7
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

  // Step 8
  examens_avant_consultation: string[];
  evolution: string;
  education_therapeutique_step8: string;
  date_prochaine_consultation_plan: string;

  // Step 9
  commentaires: string;

  created_at: string;
  updated_at: string;
}

export const getItem = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Error getting item:', error);
    return null;
  }
};

export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Error setting item:', error);
  }
};

export const getAllConsultations = async (): Promise<ConsultationData[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const consultationKeys = keys.filter(key => key.startsWith('consultation-'));
    const consultations = await AsyncStorage.multiGet(consultationKeys);

    return consultations.map(([_, value]) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    }).filter(Boolean) as ConsultationData[];
  } catch (error) {
    console.error('Error getting all consultations:', error);
    return [];
  }
};

export const saveConsultation = async (consultation: ConsultationData): Promise<void> => {
  try {
    const key = `consultation-${consultation.id}`;
    await AsyncStorage.setItem(key, JSON.stringify({
      ...consultation,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const getPatientIdentities = async (): Promise<PatientIdentity[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const patientKeys = keys.filter(key => key.startsWith('patient-'));
    const patients = await AsyncStorage.multiGet(patientKeys);

    return patients.map(([_, value]) => {
      if (value) {
        return JSON.parse(value);
      }
      return null;
    }).filter(Boolean) as PatientIdentity[];
  } catch (error) {
    console.error('Error getting patient identities:', error);
    return [];
  }
};

export const getPatientIdentity = async (id: string): Promise<PatientIdentity | null> => {
  try {
    const key = `patient-${id}`;
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting patient identity:', error);
    return null;
  }
};

export const savePatientIdentity = async (patient: PatientIdentity): Promise<void> => {
  try {
    const key = `patient-${patient.id}`;
    await AsyncStorage.setItem(key, JSON.stringify({
      ...patient,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error saving patient identity:', error);
    throw error;
  }
};