import AsyncStorage from '@react-native-async-storage/async-storage';
import { consultationAPI } from '../api';
import { ConsultationData, STORAGE_KEYS } from '../types';

export const saveConsultation = async (consultation: ConsultationData): Promise<void> => {
  try {
    // Save to MongoDB Atlas via API
    const consultationData = {
      ...consultation,
      patient_id: consultation.patient_id,
      consultation_type: consultation.consultation_type,
      consultation_date: consultation.consultation_date || new Date().toISOString(),
    };

    let response;
    if (consultation.id && consultation.id.length === 24) {
      // MongoDB ObjectId format - update
      response = await consultationAPI.update(consultation.id, consultationData);
    } else {
      // Create new consultation
      response = await consultationAPI.create(consultationData);
    }

    // Validate response structure
    if (!response || !response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    // Also save locally for offline access
    const consultations = await getConsultations();
    const existingIndex = consultations.findIndex(c => c.id === consultation.id);
    const timestamp = new Date().toISOString();
    const updatedConsultation = { 
      ...consultation, 
      id: response.data._id || response.data.id || consultation.id,
      created_at: existingIndex === -1 ? timestamp : consultations[existingIndex].created_at,
      updated_at: timestamp,
      consultation_date: consultation.consultation_date || timestamp
    };

    if (existingIndex !== -1) {
      consultations[existingIndex] = updatedConsultation;
    } else {
      consultations.push(updatedConsultation);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
  } catch (error) {
    console.error('Error saving consultation:', error);
    throw error;
  }
};

export const getConsultations = async (): Promise<ConsultationData[]> => {
  try {
    // Try to fetch from API first
    const response = await consultationAPI.getAll();
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const consultations: ConsultationData[] = response.data.map((consultation: any) => ({
        id: consultation._id || consultation.id,
        patient_id: consultation.patient_id,
        consultation_type: consultation.consultation_type || 'initial',
        consultation_date: consultation.consultation_date || new Date().toISOString(),
        // Step 1
        fosa: consultation.fosa || '',
        fosa_other: consultation.fosa_other || '',
        region: consultation.region || '',
        district: consultation.district || '',
        diagnostic_date: consultation.diagnostic_date || '',
        ipp: consultation.ipp || '',
        personnel: consultation.personnel || '',
        personnel_remplissant: consultation.personnel_remplissant || '',
        poids: consultation.poids || '',
        taille: consultation.taille || '',
        referred: consultation.referred || '',
        referred_from: consultation.referred_from || '',
        referred_from_other: consultation.referred_from_other || '',
        referred_for: consultation.referred_for || '',
        // Step 2
        full_name: consultation.full_name || '',
        age: consultation.age || '',
        birth_date: consultation.birth_date || '',
        sex: consultation.sex || '',
        quartier: consultation.quartier || '',
        lieu_dit: consultation.lieu_dit || '',
        address: consultation.address || '',
        emergency_contact_name: consultation.emergency_contact_name || '',
        emergency_contact_relation: consultation.emergency_contact_relation || '',
        emergency_contact_phone: consultation.emergency_contact_phone || '',
        patient_phone: consultation.patient_phone || '',
        patient_phone_number: consultation.patient_phone_number || '',
        lives_with: consultation.lives_with || '',
        vit_avec_patient: consultation.vit_avec_patient || '',
        lien_avec_patient: consultation.lien_avec_patient || '',
        insurance: consultation.insurance || '',
        insurance_other: consultation.insurance_other || '',
        support_group: consultation.support_group || '',
        group_name: consultation.group_name || '',
        appartient_groupe: consultation.appartient_groupe || '',
        nom_groupe_association: consultation.nom_groupe_association || '',
        parents: consultation.parents || '',
        sibling_rank: consultation.sibling_rank || '',
        rang_fratrie: consultation.rang_fratrie || '',
        nombre_drepanocytaire_fratrie: consultation.nombre_drepanocytaire_fratrie || '',
        // Step 3
        sickle_type: consultation.sickle_type || '',
        diagnosis_age: consultation.diagnosis_age || '',
        diagnosis_circumstance: consultation.diagnosis_circumstance || '',
        family_history: consultation.family_history || '',
        other_medical_history: consultation.other_medical_history || '',
        autres_antecedents_medicaux: consultation.autres_antecedents_medicaux || '',
        other_medical_history_details: consultation.other_medical_history_details || '',
        previous_surgeries: consultation.previous_surgeries || '',
        interventions_chirurgicales_anterieures: consultation.interventions_chirurgicales_anterieures || '',
        date_derniere_intervention: consultation.date_derniere_intervention || '',
        cause_derniere_intervention: consultation.cause_derniere_intervention || '',
        acide_folique_step3: consultation.acide_folique_step3 || '',
        nombre_crises_vaso: consultation.nombre_crises_vaso || '',
        allergies: consultation.allergies || '',
        allergies_details: consultation.allergies_details || '',
        // Step 4
        vocs: consultation.vocs || '',
        cvo_3_derniers_mois: consultation.cvo_3_derniers_mois || '',
        hospitalizations: consultation.hospitalizations || '',
        hospitalisations_3_derniers_mois: consultation.hospitalisations_3_derniers_mois || '',
        nombre_hospitalisations_3mois: consultation.nombre_hospitalisations_3mois || '',
        hospitalization_cause: consultation.hospitalization_cause || '',
        longest_hospitalization: consultation.longest_hospitalization || '',
        hb_1: consultation.hb_1 || '',
        hb_2: consultation.hb_2 || '',
        hb_3: consultation.hb_3 || '',
        taux_hemoglobine_recent: consultation.taux_hemoglobine_recent || '',
        taux_hbf_recent: consultation.taux_hbf_recent || '',
        taux_hbs_recent: consultation.taux_hbs_recent || '',
        hbf_1: consultation.hbf_1 || '',
        hbf_2: consultation.hbf_2 || '',
        hbf_3: consultation.hbf_3 || '',
        hbs_1: consultation.hbs_1 || '',
        hbs_2: consultation.hbs_2 || '',
        hbs_3: consultation.hbs_3 || '',
        transfusion_reaction: consultation.transfusion_reaction || '',
        reaction_types: consultation.reaction_types || [],
        reaction_type_other: consultation.reaction_type_other || '',
        allo_immunization: consultation.allo_immunization || '',
        hyperviscosity: consultation.hyperviscosity || '',
        acute_chest_syndrome: consultation.acute_chest_syndrome || '',
        acute_event: consultation.acute_event || '',
        acute_event_details: consultation.acute_event_details || '',
        stroke: consultation.stroke || '',
        priapism: consultation.priapism || '',
        leg_ulcer: consultation.leg_ulcer || '',
        cholecystectomy: consultation.cholecystectomy || '',
        asplenia: consultation.asplenia || '',
        recommended_vaccines: consultation.recommended_vaccines || [],
        drug_side_effects: consultation.drug_side_effects || '',
        // Step 5
        hydroxyurea: consultation.hydroxyurea || '',
        tolerance: consultation.tolerance || '',
        hydroxyurea_reasons: consultation.hydroxyurea_reasons || '',
        hydroxyurea_dosage: consultation.hydroxyurea_dosage || '',
        posologie_hydroxyurea: consultation.posologie_hydroxyurea || '',
        folic_acid: consultation.folic_acid || '',
        antibio_prophylaxie: consultation.antibio_prophylaxie || '',
        regular_transfusion: consultation.regular_transfusion || '',
        transfusion_type: consultation.transfusion_type || '',
        type_transfusion_sanguine: consultation.type_transfusion_sanguine || '',
        transfusion_frequency: consultation.transfusion_frequency || '',
        frequence_transfusion_3mois: consultation.frequence_transfusion_3mois || '',
        last_transfusion_date: consultation.last_transfusion_date || '',
        autres_traitements_specifiques: consultation.autres_traitements_specifiques || '',
        observance: consultation.observance || [],
        // Step 6
        nfs_gb: consultation.nfs_gb || '',
        nfs_hb: consultation.nfs_hb || '',
        nfs_pqts: consultation.nfs_pqts || '',
        reticulocytes: consultation.reticulocytes || '',
        microalbuminuria: consultation.microalbuminuria || '',
        hemolysis: consultation.hemolysis || '',
        gs_rh: consultation.gs_rh || '',
        imagerie_medical: consultation.imagerie_medical || '',
        ophtalmologie: consultation.ophtalmologie || '',
        consultations_specialisees: consultation.consultations_specialisees || '',
        examen_du_jour: consultation.examen_du_jour || '',
        // Step 7
        impact_scolaire: consultation.impact_scolaire || '',
        participation_causeries: consultation.participation_causeries || '',
        suivie_psychologique: consultation.suivie_psychologique || '',
        education_therapeutique: consultation.education_therapeutique || '',
        consultation_psychologique: consultation.consultation_psychologique || '',
        visite_domicile: consultation.visite_domicile || '',
        soutien_social: consultation.soutien_social || '',
        soutien_social_options: consultation.soutien_social_options || [],
        impact_social: consultation.impact_social || '',
        accompagnement_special: consultation.accompagnement_special || '',
        famille_informee: consultation.famille_informee || '',
        plan_suivi_personnalise: consultation.plan_suivi_personnalise || '',
        date_prochaine_consultation: consultation.date_prochaine_consultation || '',
        // Step 8
        examens_avant_consultation: consultation.examens_avant_consultation || [''],
        evolution: consultation.evolution || '',
        education_therapeutique_step8: consultation.education_therapeutique_step8 || '',
        date_prochaine_consultation_plan: consultation.date_prochaine_consultation_plan || '',
        // Step 9
        commentaires: consultation.commentaires || '',
        created_at: consultation.created_at || new Date().toISOString(),
        updated_at: consultation.updated_at || new Date().toISOString(),
      }));

      // Save to local storage for offline access
      await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(consultations));
      return consultations;
    }

    // Fallback to local storage if API fails
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting consultations from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.error('Error getting consultations from local storage:', localError);
      return [];
    }
  }
};

export const getConsultationsByPatientId = async (patientId: string): Promise<ConsultationData[]> => {
  try {
    // Try to fetch from API first
    const response = await consultationAPI.getByPatientId(patientId);
    if (response && response.success && response.data) {
      // Transform API data to match frontend format (similar to getConsultations)
      const consultations: ConsultationData[] = response.data.map((consultation: any) => ({
        id: consultation._id || consultation.id,
        patient_id: consultation.patient_id,
        consultation_type: consultation.consultation_type || 'initial',
        consultation_date: consultation.consultation_date || new Date().toISOString(),
        // Include all fields similar to getConsultations
        fosa: consultation.fosa || '',
        fosa_other: consultation.fosa_other || '',
        region: consultation.region || '',
        district: consultation.district || '',
        diagnostic_date: consultation.diagnostic_date || '',
        ipp: consultation.ipp || '',
        personnel: consultation.personnel || '',
        personnel_remplissant: consultation.personnel_remplissant || '',
        poids: consultation.poids || '',
        taille: consultation.taille || '',
        referred: consultation.referred || '',
        referred_from: consultation.referred_from || '',
        referred_from_other: consultation.referred_from_other || '',
        referred_for: consultation.referred_for || '',
        full_name: consultation.full_name || '',
        age: consultation.age || '',
        birth_date: consultation.birth_date || '',
        sex: consultation.sex || '',
        quartier: consultation.quartier || '',
        lieu_dit: consultation.lieu_dit || '',
        address: consultation.address || '',
        emergency_contact_name: consultation.emergency_contact_name || '',
        emergency_contact_relation: consultation.emergency_contact_relation || '',
        emergency_contact_phone: consultation.emergency_contact_phone || '',
        patient_phone: consultation.patient_phone || '',
        patient_phone_number: consultation.patient_phone_number || '',
        lives_with: consultation.lives_with || '',
        vit_avec_patient: consultation.vit_avec_patient || '',
        lien_avec_patient: consultation.lien_avec_patient || '',
        insurance: consultation.insurance || '',
        insurance_other: consultation.insurance_other || '',
        support_group: consultation.support_group || '',
        group_name: consultation.group_name || '',
        appartient_groupe: consultation.appartient_groupe || '',
        nom_groupe_association: consultation.nom_groupe_association || '',
        parents: consultation.parents || '',
        sibling_rank: consultation.sibling_rank || '',
        rang_fratrie: consultation.rang_fratrie || '',
        nombre_drepanocytaire_fratrie: consultation.nombre_drepanocytaire_fratrie || '',
        sickle_type: consultation.sickle_type || '',
        diagnosis_age: consultation.diagnosis_age || '',
        diagnosis_circumstance: consultation.diagnosis_circumstance || '',
        family_history: consultation.family_history || '',
        other_medical_history: consultation.other_medical_history || '',
        autres_antecedents_medicaux: consultation.autres_antecedents_medicaux || '',
        other_medical_history_details: consultation.other_medical_history_details || '',
        previous_surgeries: consultation.previous_surgeries || '',
        interventions_chirurgicales_anterieures: consultation.interventions_chirurgicales_anterieures || '',
        date_derniere_intervention: consultation.date_derniere_intervention || '',
        cause_derniere_intervention: consultation.cause_derniere_intervention || '',
        acide_folique_step3: consultation.acide_folique_step3 || '',
        nombre_crises_vaso: consultation.nombre_crises_vaso || '',
        allergies: consultation.allergies || '',
        allergies_details: consultation.allergies_details || '',
        vocs: consultation.vocs || '',
        cvo_3_derniers_mois: consultation.cvo_3_derniers_mois || '',
        hospitalizations: consultation.hospitalizations || '',
        hospitalisations_3_derniers_mois: consultation.hospitalisations_3_derniers_mois || '',
        nombre_hospitalisations_3mois: consultation.nombre_hospitalisations_3mois || '',
        hospitalization_cause: consultation.hospitalization_cause || '',
        longest_hospitalization: consultation.longest_hospitalization || '',
        hb_1: consultation.hb_1 || '',
        hb_2: consultation.hb_2 || '',
        hb_3: consultation.hb_3 || '',
        taux_hemoglobine_recent: consultation.taux_hemoglobine_recent || '',
        taux_hbf_recent: consultation.taux_hbf_recent || '',
        taux_hbs_recent: consultation.taux_hbs_recent || '',
        hbf_1: consultation.hbf_1 || '',
        hbf_2: consultation.hbf_2 || '',
        hbf_3: consultation.hbf_3 || '',
        hbs_1: consultation.hbs_1 || '',
        hbs_2: consultation.hbs_2 || '',
        hbs_3: consultation.hbs_3 || '',
        transfusion_reaction: consultation.transfusion_reaction || '',
        reaction_types: consultation.reaction_types || [],
        reaction_type_other: consultation.reaction_type_other || '',
        allo_immunization: consultation.allo_immunization || '',
        hyperviscosity: consultation.hyperviscosity || '',
        acute_chest_syndrome: consultation.acute_chest_syndrome || '',
        acute_event: consultation.acute_event || '',
        acute_event_details: consultation.acute_event_details || '',
        stroke: consultation.stroke || '',
        priapism: consultation.priapism || '',
        leg_ulcer: consultation.leg_ulcer || '',
        cholecystectomy: consultation.cholecystectomy || '',
        asplenia: consultation.asplenia || '',
        recommended_vaccines: consultation.recommended_vaccines || [],
        drug_side_effects: consultation.drug_side_effects || '',
        hydroxyurea: consultation.hydroxyurea || '',
        tolerance: consultation.tolerance || '',
        hydroxyurea_reasons: consultation.hydroxyurea_reasons || '',
        hydroxyurea_dosage: consultation.hydroxyurea_dosage || '',
        posologie_hydroxyurea: consultation.posologie_hydroxyurea || '',
        folic_acid: consultation.folic_acid || '',
        antibio_prophylaxie: consultation.antibio_prophylaxie || '',
        regular_transfusion: consultation.regular_transfusion || '',
        transfusion_type: consultation.transfusion_type || '',
        type_transfusion_sanguine: consultation.type_transfusion_sanguine || '',
        transfusion_frequency: consultation.transfusion_frequency || '',
        frequence_transfusion_3mois: consultation.frequence_transfusion_3mois || '',
        last_transfusion_date: consultation.last_transfusion_date || '',
        autres_traitements_specifiques: consultation.autres_traitements_specifiques || '',
        observance: consultation.observance || [],
        nfs_gb: consultation.nfs_gb || '',
        nfs_hb: consultation.nfs_hb || '',
        nfs_pqts: consultation.nfs_pqts || '',
        reticulocytes: consultation.reticulocytes || '',
        microalbuminuria: consultation.microalbuminuria || '',
        hemolysis: consultation.hemolysis || '',
        gs_rh: consultation.gs_rh || '',
        imagerie_medical: consultation.imagerie_medical || '',
        ophtalmologie: consultation.ophtalmologie || '',
        consultations_specialisees: consultation.consultations_specialisees || '',
        examen_du_jour: consultation.examen_du_jour || '',
        impact_scolaire: consultation.impact_scolaire || '',
        participation_causeries: consultation.participation_causeries || '',
        suivie_psychologique: consultation.suivie_psychologique || '',
        education_therapeutique: consultation.education_therapeutique || '',
        consultation_psychologique: consultation.consultation_psychologique || '',
        visite_domicile: consultation.visite_domicile || '',
        soutien_social: consultation.soutien_social || '',
        soutien_social_options: consultation.soutien_social_options || [],
        impact_social: consultation.impact_social || '',
        accompagnement_special: consultation.accompagnement_special || '',
        famille_informee: consultation.famille_informee || '',
        plan_suivi_personnalise: consultation.plan_suivi_personnalise || '',
        date_prochaine_consultation: consultation.date_prochaine_consultation || '',
        examens_avant_consultation: consultation.examens_avant_consultation || [''],
        evolution: consultation.evolution || '',
        education_therapeutique_step8: consultation.education_therapeutique_step8 || '',
        date_prochaine_consultation_plan: consultation.date_prochaine_consultation_plan || '',
        commentaires: consultation.commentaires || '',
        created_at: consultation.created_at || new Date().toISOString(),
        updated_at: consultation.updated_at || new Date().toISOString(),
      }));

      // Update local storage
      const allConsultations = await getConsultations();
      const updatedConsultations = [...allConsultations];
      consultations.forEach(newConsultation => {
        const existingIndex = updatedConsultations.findIndex(c => c.id === newConsultation.id);
        if (existingIndex !== -1) {
          updatedConsultations[existingIndex] = newConsultation;
        } else {
          updatedConsultations.push(newConsultation);
        }
      });
      await AsyncStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(updatedConsultations));

      return consultations;
    }

    // Fallback to local storage
    const consultations = await getConsultations();
    return consultations.filter(c => c.patient_id === patientId);
  } catch (error) {
    console.error('Error getting consultations by patient id from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const consultations = await getConsultations();
      return consultations.filter(c => c.patient_id === patientId);
    } catch (localError) {
      console.error('Error getting consultations from local storage:', localError);
      return [];
    }
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

