import AsyncStorage from '@react-native-async-storage/async-storage';
import { followUpAPI } from '../api';
import { FollowUpData, STORAGE_KEYS } from '../types';

export const saveFollowUp = async (followUp: FollowUpData): Promise<void> => {
  try {
    // Save to MongoDB Atlas via API
    const followUpData = {
      ...followUp,
      patient_id: followUp.patient_id,
      consultation_id: followUp.consultation_id,
      follow_up_number: followUp.follow_up_number,
      follow_up_date: followUp.follow_up_date || new Date().toISOString(),
    };

    let response;
    if (followUp.id && followUp.id.length === 24) {
      // MongoDB ObjectId format - update
      response = await followUpAPI.update(followUp.id, followUpData);
    } else {
      // Create new follow-up
      response = await followUpAPI.create(followUpData);
    }

    // Validate response structure
    if (!response || !response.success || !response.data) {
      throw new Error('Invalid response from server');
    }

    // Also save locally for offline access
    const followUps = await getFollowUps();
    const existingIndex = followUps.findIndex(f => f.id === followUp.id);
    const timestamp = new Date().toISOString();
    const updatedFollowUp = { 
      ...followUp, 
      id: response.data._id || response.data.id || followUp.id,
      created_at: existingIndex === -1 ? timestamp : followUps[existingIndex].created_at,
      updated_at: timestamp
    };

    if (existingIndex !== -1) {
      followUps[existingIndex] = updatedFollowUp;
    } else {
      followUps.push(updatedFollowUp);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
  } catch (error) {
    console.error('Error saving follow-up:', error);
    throw error;
  }
};

export const getFollowUps = async (): Promise<FollowUpData[]> => {
  try {
    // Try to fetch from API first
    const response = await followUpAPI.getAll();
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const followUps: FollowUpData[] = response.data.map((followUp: any) => ({
        id: followUp._id || followUp.id,
        patient_id: followUp.patient_id,
        consultation_id: followUp.consultation_id,
        follow_up_number: followUp.follow_up_number || 1,
        follow_up_date: followUp.follow_up_date || new Date().toISOString(),
        poids: followUp.poids || '',
        taille: followUp.taille || '',
        cvo_3_derniers_mois: followUp.cvo_3_derniers_mois || '',
        hospitalisations_3_derniers_mois: followUp.hospitalisations_3_derniers_mois || '',
        hospitalization_cause: followUp.hospitalization_cause || '',
        taux_hemoglobine_recent: followUp.taux_hemoglobine_recent || '',
        taux_hbf_recent: followUp.taux_hbf_recent || '',
        taux_hbs_recent: followUp.taux_hbs_recent || '',
        hydroxyurea: followUp.hydroxyurea || '',
        tolerance: followUp.tolerance || '',
        posologie_hydroxyurea: followUp.posologie_hydroxyurea || '',
        folic_acid: followUp.folic_acid || '',
        antibio_prophylaxie: followUp.antibio_prophylaxie || '',
        regular_transfusion: followUp.regular_transfusion || '',
        type_transfusion_sanguine: followUp.type_transfusion_sanguine || '',
        frequence_transfusion_3mois: followUp.frequence_transfusion_3mois || '',
        last_transfusion_date: followUp.last_transfusion_date || '',
        autres_traitements_specifiques: followUp.autres_traitements_specifiques || '',
        observance: followUp.observance || [],
        nfs_gb: followUp.nfs_gb || '',
        nfs_hb: followUp.nfs_hb || '',
        nfs_pqts: followUp.nfs_pqts || '',
        reticulocytes: followUp.reticulocytes || '',
        microalbuminuria: followUp.microalbuminuria || '',
        impact_scolaire: followUp.impact_scolaire || '',
        participation_causeries: followUp.participation_causeries || '',
        suivie_psychologique: followUp.suivie_psychologique || '',
        education_therapeutique: followUp.education_therapeutique || '',
        visite_domicile: followUp.visite_domicile || '',
        soutien_social: followUp.soutien_social || '',
        evolution: followUp.evolution || '',
        commentaires: followUp.commentaires || '',
        date_prochaine_consultation: followUp.date_prochaine_consultation || '',
        created_at: followUp.created_at || new Date().toISOString(),
        updated_at: followUp.updated_at || new Date().toISOString(),
      }));

      // Save to local storage for offline access
      await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(followUps));
      return followUps;
    }

    // Fallback to local storage if API fails
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting follow-ups from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FOLLOW_UPS);
      return data ? JSON.parse(data) : [];
    } catch (localError) {
      console.error('Error getting follow-ups from local storage:', localError);
      return [];
    }
  }
};

export const getFollowUpsByPatientId = async (patientId: string): Promise<FollowUpData[]> => {
  try {
    // Try to fetch from API first
    const response = await followUpAPI.getByPatientId(patientId);
    if (response && response.success && response.data) {
      // Transform API data to match frontend format
      const followUps: FollowUpData[] = response.data.map((followUp: any) => ({
        id: followUp._id || followUp.id,
        patient_id: followUp.patient_id,
        consultation_id: followUp.consultation_id,
        follow_up_number: followUp.follow_up_number || 1,
        follow_up_date: followUp.follow_up_date || new Date().toISOString(),
        poids: followUp.poids || '',
        taille: followUp.taille || '',
        cvo_3_derniers_mois: followUp.cvo_3_derniers_mois || '',
        hospitalisations_3_derniers_mois: followUp.hospitalisations_3_derniers_mois || '',
        hospitalization_cause: followUp.hospitalization_cause || '',
        taux_hemoglobine_recent: followUp.taux_hemoglobine_recent || '',
        taux_hbf_recent: followUp.taux_hbf_recent || '',
        taux_hbs_recent: followUp.taux_hbs_recent || '',
        hydroxyurea: followUp.hydroxyurea || '',
        tolerance: followUp.tolerance || '',
        posologie_hydroxyurea: followUp.posologie_hydroxyurea || '',
        folic_acid: followUp.folic_acid || '',
        antibio_prophylaxie: followUp.antibio_prophylaxie || '',
        regular_transfusion: followUp.regular_transfusion || '',
        type_transfusion_sanguine: followUp.type_transfusion_sanguine || '',
        frequence_transfusion_3mois: followUp.frequence_transfusion_3mois || '',
        last_transfusion_date: followUp.last_transfusion_date || '',
        autres_traitements_specifiques: followUp.autres_traitements_specifiques || '',
        observance: followUp.observance || [],
        nfs_gb: followUp.nfs_gb || '',
        nfs_hb: followUp.nfs_hb || '',
        nfs_pqts: followUp.nfs_pqts || '',
        reticulocytes: followUp.reticulocytes || '',
        microalbuminuria: followUp.microalbuminuria || '',
        impact_scolaire: followUp.impact_scolaire || '',
        participation_causeries: followUp.participation_causeries || '',
        suivie_psychologique: followUp.suivie_psychologique || '',
        education_therapeutique: followUp.education_therapeutique || '',
        visite_domicile: followUp.visite_domicile || '',
        soutien_social: followUp.soutien_social || '',
        evolution: followUp.evolution || '',
        commentaires: followUp.commentaires || '',
        date_prochaine_consultation: followUp.date_prochaine_consultation || '',
        created_at: followUp.created_at || new Date().toISOString(),
        updated_at: followUp.updated_at || new Date().toISOString(),
      }));

      // Update local storage
      const allFollowUps = await getFollowUps();
      const updatedFollowUps = [...allFollowUps];
      followUps.forEach(newFollowUp => {
        const existingIndex = updatedFollowUps.findIndex(f => f.id === newFollowUp.id);
        if (existingIndex !== -1) {
          updatedFollowUps[existingIndex] = newFollowUp;
        } else {
          updatedFollowUps.push(newFollowUp);
        }
      });
      await AsyncStorage.setItem(STORAGE_KEYS.FOLLOW_UPS, JSON.stringify(updatedFollowUps));

      return followUps.sort((a, b) =>
        new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime()
      );
    }

    // Fallback to local storage
    const followUps = await getFollowUps();
    return followUps.filter(f => f.patient_id === patientId).sort((a, b) =>
      new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime()
    );
  } catch (error) {
    console.error('Error getting follow-ups by patient id from API, falling back to local storage:', error);
    // Fallback to local storage
    try {
      const followUps = await getFollowUps();
      return followUps.filter(f => f.patient_id === patientId).sort((a, b) =>
        new Date(a.follow_up_date).getTime() - new Date(b.follow_up_date).getTime()
      );
    } catch (localError) {
      console.error('Error getting follow-ups from local storage:', localError);
      return [];
    }
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

