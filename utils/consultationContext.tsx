import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConsultationData } from './storage';
import { v4 as uuidv4 } from 'uuid';

interface ConsultationContextType {
  formData: ConsultationData;
  updateFormData: (key: keyof ConsultationData, value: any) => void;
  resetForm: (patientId?: string) => void;
  handleCheckbox: (key: keyof ConsultationData, value: string) => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (!context) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};

interface ConsultationProviderProps {
  children: ReactNode;
  initialPatientId?: string;
}

export const ConsultationProvider: React.FC<ConsultationProviderProps> = ({
  children,
  initialPatientId = ''
}) => {
  const [formData, setFormData] = useState<ConsultationData>({
    id: uuidv4(),
    patient_id: initialPatientId,
    consultation_type: 'initial',
    consultation_date: new Date().toISOString(),
    // Step 1
    fosa: '',
    fosa_other: '',
    region: '',
    district: '',
    diagnostic_date: '',
    ipp: '',
    personnel: '',
    personnel_remplissant: '',
    poids: '',
    taille: '',
    referred: '',
    referred_from: '',
    referred_from_other: '',
    referred_for: '',

    // Step 2
    full_name: '',
    age: '',
    birth_date: '',
    sex: '',
    quartier: '',
    lieu_dit: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_relation: '',
    emergency_contact_phone: '',
    patient_phone: '',
    patient_phone_number: '',
    lives_with: '',
    vit_avec_patient: '',
    lien_avec_patient: '',
    insurance: '',
    insurance_other: '',
    support_group: '',
    group_name: '',
    appartient_groupe: '',
    nom_groupe_association: '',
    parents: '',
    sibling_rank: '',
    rang_fratrie: '',
    nombre_drepanocytaire_fratrie: '',

    // Step 3
    sickle_type: '',
    diagnosis_age: '',
    diagnosis_circumstance: '',
    family_history: '',
    other_medical_history: '',
    autres_antecedents_medicaux: '',
    other_medical_history_details: '',
    previous_surgeries: '',
    interventions_chirurgicales_anterieures: '',
    date_derniere_intervention: '',
    cause_derniere_intervention: '',
    acide_folique_step3: '',
    nombre_crises_vaso: '',
    allergies: '',
    allergies_details: '',

    // Step 4
    vocs: '',
    cvo_3_derniers_mois: '',
    hospitalizations: '',
    hospitalisations_3_derniers_mois: '',
    nombre_hospitalisations_3mois: '',
    hospitalization_cause: '',
    longest_hospitalization: '',
    hb_1: '',
    hb_2: '',
    hb_3: '',
    taux_hemoglobine_recent: '',
    taux_hbf_recent: '',
    taux_hbs_recent: '',
    hbf_1: '',
    hbf_2: '',
    hbf_3: '',
    hbs_1: '',
    hbs_2: '',
    hbs_3: '',
    transfusion_reaction: '',
    reaction_types: [],
    reaction_type_other: '',
    allo_immunization: '',
    hyperviscosity: '',
    acute_chest_syndrome: '',
    acute_event: '',
    acute_event_details: '',
    stroke: '',
    priapism: '',
    leg_ulcer: '',
    cholecystectomy: '',
    asplenia: '',
    recommended_vaccines: [],
    drug_side_effects: '',

    // Step 5
    hydroxyurea: '',
    tolerance: '',
    hydroxyurea_reasons: '',
    hydroxyurea_dosage: '',
    posologie_hydroxyurea: '',
    folic_acid: '',
    antibio_prophylaxie: '',
    regular_transfusion: '',
    transfusion_type: '',
    type_transfusion_sanguine: '',
    transfusion_frequency: '',
    frequence_transfusion_3mois: '',
    last_transfusion_date: '',
    autres_traitements_specifiques: '',
    observance: [],

    // Step 6
    nfs_gb: '',
    nfs_hb: '',
    nfs_pqts: '',
    reticulocytes: '',
    microalbuminuria: '',
    hemolysis: '',
    gs_rh: '',
    imagerie_medical: '',
    ophtalmologie: '',
    consultations_specialisees: '',
    examen_du_jour: '',

    // Step 7
    impact_scolaire: '',
    participation_causeries: '',
    suivie_psychologique: '',
    education_therapeutique: '',
    consultation_psychologique: '',
    visite_domicile: '',
    soutien_social: '',
    soutien_social_options: [],
    impact_social: '',
    accompagnement_special: '',
    famille_informee: '',
    plan_suivi_personnalise: '',
    date_prochaine_consultation: '',

    // Step 8
    examens_avant_consultation: [''],
    evolution: '',
    education_therapeutique_step8: '',
    date_prochaine_consultation_plan: '',

    // Step 9
    commentaires: '',

    created_at: '',
    updated_at: '',
  });

  const updateFormData = (key: keyof ConsultationData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key: keyof ConsultationData, value: string) => {
    const current = (formData[key] as string[]) || [];
    if (current.includes(value)) {
      updateFormData(key, current.filter(v => v !== value));
    } else {
      updateFormData(key, [...current, value]);
    }
  };

  const resetForm = (patientId?: string) => {
    setFormData({
      id: uuidv4(),
      patient_id: patientId || '',
      consultation_type: 'initial',
      consultation_date: new Date().toISOString(),
      // Reset all fields to empty
      fosa: '',
      fosa_other: '',
      region: '',
      district: '',
      diagnostic_date: '',
      ipp: '',
      personnel: '',
      personnel_remplissant: '',
      poids: '',
      taille: '',
      referred: '',
      referred_from: '',
      referred_from_other: '',
      referred_for: '',
      full_name: '',
      age: '',
      birth_date: '',
      sex: '',
      quartier: '',
      lieu_dit: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_relation: '',
      emergency_contact_phone: '',
      patient_phone: '',
      patient_phone_number: '',
      lives_with: '',
      vit_avec_patient: '',
      lien_avec_patient: '',
      insurance: '',
      insurance_other: '',
      support_group: '',
      group_name: '',
      appartient_groupe: '',
      nom_groupe_association: '',
      parents: '',
      sibling_rank: '',
      rang_fratrie: '',
      nombre_drepanocytaire_fratrie: '',
      sickle_type: '',
      diagnosis_age: '',
      diagnosis_circumstance: '',
      family_history: '',
      other_medical_history: '',
      autres_antecedents_medicaux: '',
      other_medical_history_details: '',
      previous_surgeries: '',
      interventions_chirurgicales_anterieures: '',
      date_derniere_intervention: '',
      cause_derniere_intervention: '',
      acide_folique_step3: '',
      nombre_crises_vaso: '',
      allergies: '',
      allergies_details: '',
      vocs: '',
      cvo_3_derniers_mois: '',
      hospitalizations: '',
      hospitalisations_3_derniers_mois: '',
      nombre_hospitalisations_3mois: '',
      hospitalization_cause: '',
      longest_hospitalization: '',
      hb_1: '',
      hb_2: '',
      hb_3: '',
      taux_hemoglobine_recent: '',
      taux_hbf_recent: '',
      taux_hbs_recent: '',
      hbf_1: '',
      hbf_2: '',
      hbf_3: '',
      hbs_1: '',
      hbs_2: '',
      hbs_3: '',
      transfusion_reaction: '',
      reaction_types: [],
      reaction_type_other: '',
      allo_immunization: '',
      hyperviscosity: '',
      acute_chest_syndrome: '',
      acute_event: '',
      acute_event_details: '',
      stroke: '',
      priapism: '',
      leg_ulcer: '',
      cholecystectomy: '',
      asplenia: '',
      recommended_vaccines: [],
      drug_side_effects: '',
      hydroxyurea: '',
      tolerance: '',
      hydroxyurea_reasons: '',
      hydroxyurea_dosage: '',
      posologie_hydroxyurea: '',
      folic_acid: '',
      antibio_prophylaxie: '',
      regular_transfusion: '',
      transfusion_type: '',
      type_transfusion_sanguine: '',
      transfusion_frequency: '',
      frequence_transfusion_3mois: '',
      last_transfusion_date: '',
      autres_traitements_specifiques: '',
      observance: [],
      nfs_gb: '',
      nfs_hb: '',
      nfs_pqts: '',
      reticulocytes: '',
      microalbuminuria: '',
      hemolysis: '',
      gs_rh: '',
      imagerie_medical: '',
      ophtalmologie: '',
      consultations_specialisees: '',
      examen_du_jour: '',
      impact_scolaire: '',
      participation_causeries: '',
      suivie_psychologique: '',
      education_therapeutique: '',
      consultation_psychologique: '',
      visite_domicile: '',
      soutien_social: '',
      soutien_social_options: [],
      impact_social: '',
      accompagnement_special: '',
      famille_informee: '',
      plan_suivi_personnalise: '',
      date_prochaine_consultation: '',
      examens_avant_consultation: [''],
      evolution: '',
      education_therapeutique_step8: '',
      date_prochaine_consultation_plan: '',
      commentaires: '',
      created_at: '',
      updated_at: '',
    });
  };

  return (
    <ConsultationContext.Provider value={{ formData, updateFormData, resetForm, handleCheckbox }}>
      {children}
    </ConsultationContext.Provider>
  );
};