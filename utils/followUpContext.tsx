import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FollowUpData } from './storage';
import { v4 as uuidv4 } from 'uuid';

interface FollowUpContextType {
  formData: FollowUpData;
  updateFormData: (key: keyof FollowUpData, value: any) => void;
  resetForm: (patientId?: string) => void;
  handleCheckbox: (key: keyof FollowUpData, value: string) => void;
}

const FollowUpContext = createContext<FollowUpContextType | undefined>(undefined);

export const useFollowUp = () => {
  const context = useContext(FollowUpContext);
  if (!context) {
    throw new Error('useFollowUp must be used within a FollowUpProvider');
  }
  return context;
};

interface FollowUpProviderProps {
  children: ReactNode;
  initialPatientId?: string;
  followUpNumber?: number;
}

export const FollowUpProvider: React.FC<FollowUpProviderProps> = ({
  children,
  initialPatientId = '',
  followUpNumber = 1
}) => {
  const [formData, setFormData] = useState<FollowUpData>({
    id: uuidv4(),
    patient_id: initialPatientId,
    consultation_id: '',
    follow_up_number: followUpNumber,
    follow_up_date: new Date().toISOString(),

    poids: '',
    taille: '',
    cvo_3_derniers_mois: '',
    hospitalisations_3_derniers_mois: '',
    hospitalization_cause: '',
    taux_hemoglobine_recent: '',
    taux_hbf_recent: '',
    taux_hbs_recent: '',

    hydroxyurea: '',
    tolerance: '',
    posologie_hydroxyurea: '',
    folic_acid: '',
    antibio_prophylaxie: '',
    regular_transfusion: '',
    type_transfusion_sanguine: '',
    frequence_transfusion_3mois: '',
    last_transfusion_date: '',
    autres_traitements_specifiques: '',
    observance: [],

    nfs_gb: '',
    nfs_hb: '',
    nfs_pqts: '',
    reticulocytes: '',
    microalbuminuria: '',

    impact_scolaire: '',
    participation_causeries: '',
    suivie_psychologique: '',
    education_therapeutique: '',
    visite_domicile: '',
    soutien_social: '',

    evolution: '',
    commentaires: '',
    date_prochaine_consultation: '',

    created_at: '',
    updated_at: '',
  });

  const updateFormData = (key: keyof FollowUpData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckbox = (key: keyof FollowUpData, value: string) => {
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
      consultation_id: '',
      follow_up_number: followUpNumber,
      follow_up_date: new Date().toISOString(),

      poids: '',
      taille: '',
      cvo_3_derniers_mois: '',
      hospitalisations_3_derniers_mois: '',
      hospitalization_cause: '',
      taux_hemoglobine_recent: '',
      taux_hbf_recent: '',
      taux_hbs_recent: '',

      hydroxyurea: '',
      tolerance: '',
      posologie_hydroxyurea: '',
      folic_acid: '',
      antibio_prophylaxie: '',
      regular_transfusion: '',
      type_transfusion_sanguine: '',
      frequence_transfusion_3mois: '',
      last_transfusion_date: '',
      autres_traitements_specifiques: '',
      observance: [],

      nfs_gb: '',
      nfs_hb: '',
      nfs_pqts: '',
      reticulocytes: '',
      microalbuminuria: '',

      impact_scolaire: '',
      participation_causeries: '',
      suivie_psychologique: '',
      education_therapeutique: '',
      visite_domicile: '',
      soutien_social: '',

      evolution: '',
      commentaires: '',
      date_prochaine_consultation: '',

      created_at: '',
      updated_at: '',
    });
  };

  return (
    <FollowUpContext.Provider value={{ formData, updateFormData, resetForm, handleCheckbox }}>
      {children}
    </FollowUpContext.Provider>
  );
};