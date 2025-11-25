// Type definitions for storage
export interface PatientProfile {
  id: string;
  numero_identification_unique: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  age: string;
  sexe: string;
  quartier: string;
  lieu_dit: string;
  contact_urgence_nom: string;
  contact_urgence_telephone: string;
  contact_urgence_relation: string;
  telephone_patient: string;
  vit_avec_le_patient: boolean;
  lien_avec_patient: string;
  patient_refere: boolean;
  patient_refere_de: string;
  patient_refere_pour: string;
  appartient_a_groupe: boolean;
  nom_du_groupe: string;
  rang_dans_fratrie: string;
  nombre_de_drepanocytaires_dans_fratrie: string;
  assurance: string;
  type_de_drepanocytose: string;
  age_diagnostic: string;
  circonstances_du_diagnostic: string;
  region: string;
  antecedent_familiaux: string;
  autres_antecedents_medicaux: string;
  allergies_connues: boolean;
  details_allergies: string;
  groupe_sanguin_rhesus: string;

  // New profile keys
  date_diagnostic?: string;
  age_au_diagnostic?: string;
  vaccins_naissance?: Record<string, boolean>;

  // Static consultation fields moved from ConsultationData
  fosa: string;
  fosa_other: string;
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
  address: string;
  patient_phone_number: string;
  lives_with: string;
  insurance_other: string;
  support_group: string;
  group_name: string;
  appartient_groupe: string;
  nom_groupe_association: string;
  parents: string;
  sibling_rank: string;
  sickle_type: string;
  diagnosis_age: string;
  diagnosis_circumstance: string;
  family_history: string;
  other_medical_history: string;
  other_medical_history_details: string;
  previous_surgeries: string;
  interventions_chirurgicales_anterieures: string;
  date_derniere_intervention: string;
  cause_derniere_intervention: string;
  acide_folique_step3: string;
  nombre_crises_vaso: string;
  allergies: string;
  allergies_details: string;

  created_at: string;
  updated_at: string;
}

export interface ConsultationData {
  id: string;
  patient_id: string;
  consultation_type: 'initial' | 'follow_up';
  consultation_date: string;

  // Step 1 - Administrative
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

  // Step 2 - Demographics
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

  // Step 3 - Medical History
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

  // Step 4 - Complications History
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

  // Step 5 - Current Treatments
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

  // Step 6 - Complementary Exams
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

  // Step 7 - Psychosocial Impact
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

  // Step 8 - Follow-up Plan
  examens_avant_consultation: string[];
  evolution: string;
  education_therapeutique_step8: string;
  date_prochaine_consultation_plan: string;

  // Step 9 - Comments
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

// Storage keys
export const STORAGE_KEYS = {
  PATIENTS: '@patients',
  CONSULTATIONS: '@consultations',
  FOLLOW_UPS: '@follow_ups',
  VACCINATIONS: '@vaccinations',
} as const;

