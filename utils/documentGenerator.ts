import { ConsultationData } from './storage';

export const generateConsultationDocument = (consultation: ConsultationData): string => {
  const document = `
CONSULTATION MÉDICALE - DRÉPANOCYTOSE
=====================================

INFORMATIONS ADMINISTRATIVES
---------------------------
Date de consultation: ${new Date().toLocaleDateString('fr-FR')}
Structure de santé: ${consultation.fosa || 'Non spécifiée'}
Région: ${consultation.region || 'Non spécifiée'}
District: ${consultation.district || 'Non spécifié'}
Personnel remplissant: ${consultation.personnel_remplissant || 'Non spécifié'}

DONNÉES DÉMOGRAPHIQUES
----------------------
Nom complet: ${consultation.full_name || 'Non spécifié'}
Âge: ${consultation.age || 'Non spécifié'} ans
Sexe: ${consultation.sex || 'Non spécifié'}
Type de drépanocytose: ${consultation.sickle_type || 'Non spécifié'}
Quartier: ${consultation.quartier || 'Non spécifié'}
Lieu-dit: ${consultation.lieu_dit || 'Non spécifié'}

ANTÉCÉDENTS MÉDICAUX
-------------------
Âge au diagnostic: ${consultation.diagnosis_age || 'Non spécifié'}
Circonstances du diagnostic: ${consultation.diagnosis_circumstance || 'Non spécifiées'}
Antécédents familiaux: ${consultation.family_history || 'Non spécifiés'}
Allergies: ${consultation.allergies === 'Oui' ? consultation.allergies_details || 'Oui' : 'Non'}

TRAITEMENTS ACTUELS
------------------
Hydroxyurée: ${consultation.hydroxyurea || 'Non'}
Acide folique: ${consultation.folic_acid || 'Non'}
Antibioprophylaxie: ${consultation.antibio_prophylaxie || 'Non'}
Transfusion régulière: ${consultation.regular_transfusion || 'Non'}

EXAMENS COMPLÉMENTAIRES
----------------------
NFS - GB: ${consultation.nfs_gb || 'Non fait'} x10³/μL
NFS - Hb: ${consultation.nfs_hb || 'Non fait'} g/dL
NFS - Plaquettes: ${consultation.nfs_pqts || 'Non fait'} x10³/μL
Taux HbF récent: ${consultation.taux_hbf_recent || 'Non fait'}%
Taux HbS récent: ${consultation.taux_hbs_recent || 'Non fait'}%

COMMENTAIRES
-----------
${consultation.commentaires || 'Aucun commentaire'}

Généré automatiquement le ${new Date().toLocaleString('fr-FR')}
  `;

  return document;
};