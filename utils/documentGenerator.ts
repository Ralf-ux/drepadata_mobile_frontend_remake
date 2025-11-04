import { Share, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { PatientProfile, ConsultationData, FollowUpData, VaccinationRecord } from './storage';

// Helper function to safely format dates
const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('fr-FR');
};

// Convert text to RTF-safe encoding
const toRTFSafe = (text: string): string => {
  if (!text) return '';
  
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par\n')
    .replace(/é/g, "\\'e9")
    .replace(/è/g, "\\'e8")
    .replace(/ê/g, "\\'ea")
    .replace(/ë/g, "\\'eb")
    .replace(/à/g, "\\'e0")
    .replace(/â/g, "\\'e2")
    .replace(/ä/g, "\\'e4")
    .replace(/î/g, "\\'ee")
    .replace(/ï/g, "\\'ef")
    .replace(/ô/g, "\\'f4")
    .replace(/ö/g, "\\'f6")
    .replace(/ù/g, "\\'f9")
    .replace(/û/g, "\\'fb")
    .replace(/ü/g, "\\'fc")
    .replace(/ÿ/g, "\\'ff")
    .replace(/ç/g, "\\'e7")
    .replace(/œ/g, "\\'9c")
    .replace(/É/g, "\\'c9")
    .replace(/È/g, "\\'c8")
    .replace(/Ê/g, "\\'ca")
    .replace(/Ë/g, "\\'cb")
    .replace(/À/g, "\\'c0")
    .replace(/Â/g, "\\'c2")
    .replace(/Î/g, "\\'ce")
    .replace(/Ï/g, "\\'cf")
    .replace(/Ô/g, "\\'d4")
    .replace(/Ù/g, "\\'d9")
    .replace(/Û/g, "\\'db")
    .replace(/Ç/g, "\\'c7")
    .replace(/Œ/g, "\\uc1\\u338 ")
    .replace(/€/g, "\\uc1\\u8364 ")
    .replace(/°/g, "\\uc1\\u176 ");
};

// Clean and normalize text
const cleanText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  // Normalize Unicode characters
  let normalized = text.normalize('NFC');
  
  // Remove any remaining problematic characters
  normalized = normalized
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
  
  return normalized;
};

const vaccinationSchedule = [
  { period: 'Naissance', vaccine: 'BCG' },
  { period: '6 Semaines', vaccine: 'DTC-Hep B+Hib 1' },
  { period: '6 Semaines', vaccine: 'Pneumo 13-1' },
  { period: '6 Semaines', vaccine: 'VPO-1' },
  { period: '6 Semaines', vaccine: 'ROTA-1' },
  { period: '10 Semaines', vaccine: 'DTC-Hep B+Hib 2' },
  { period: '10 Semaines', vaccine: 'Pneumo 13-2' },
  { period: '10 Semaines', vaccine: 'VPO-2' },
  { period: '10 Semaines', vaccine: 'ROTA-2' },
  { period: '14 Semaines', vaccine: 'DTC-Hep B+Hib 3' },
  { period: '14 Semaines', vaccine: 'Pneumo 13-3' },
  { period: '14 Semaines', vaccine: 'VPO-3' },
  { period: '14 Semaines', vaccine: 'ROTA-3' },
  { period: '9 Mois', vaccine: 'Vit A' },
  { period: '9 Mois', vaccine: 'VAR' },
  { period: '9 Mois', vaccine: 'VAA' },
];

export const generatePatientProfileDocument = (patient: PatientProfile): string => {
  return `
PROFIL DU PATIENT
Dossier Médical - Drépanocytose


SECTION 1 : IDENTIFICATION

Numéro d'identification : ${cleanText(patient.numero_identification_unique)}
Nom                     : ${cleanText(patient.nom)}
Prénom                  : ${cleanText(patient.prenom)}
Date de naissance       : ${formatDate(patient.date_naissance)}
Âge                     : ${patient.age} ans
Sexe                    : ${cleanText(patient.sexe)}


SECTION 2 : COORDONNÉES

Quartier                : ${cleanText(patient.quartier)}
Lieu-dit                : ${cleanText(patient.lieu_dit)}
Téléphone               : ${cleanText(patient.telephone_patient)}
Région                  : ${cleanText(patient.region)}


SECTION 3 : CONTACT D'URGENCE

Nom du contact          : ${cleanText(patient.contact_urgence_nom)}
Téléphone               : ${cleanText(patient.contact_urgence_telephone)}
Relation                : ${cleanText(patient.contact_urgence_relation)}
Vit avec le patient     : ${patient.vit_avec_le_patient ? 'Oui' : 'Non'}


SECTION 4 : INFORMATIONS MÉDICALES

Type de drépanocytose   : ${cleanText(patient.type_de_drepanocytose)}
Âge au diagnostic       : ${patient.age_diagnostic} ans
Circonstances           : ${cleanText(patient.circonstances_du_diagnostic)}
Groupe sanguin/Rhésus   : ${cleanText(patient.groupe_sanguin_rhesus)}


SECTION 5 : ANTÉCÉDENTS

Antécédents familiaux   : ${cleanText(patient.antecedent_familiaux)}
Autres antécédents      : ${cleanText(patient.autres_antecedents_medicaux)}
Allergies connues       : ${patient.allergies_connues ? 'Oui' : 'Non'}
${patient.allergies_connues ? `Détails allergies       : ${cleanText(patient.details_allergies)}` : ''}


SECTION 6 : INFORMATIONS SOCIALES

Patient référé          : ${patient.patient_refere ? 'Oui' : 'Non'}
Appartient à un groupe  : ${patient.appartient_a_groupe ? 'Oui' : 'Non'}
Rang dans la fratrie    : ${cleanText(patient.rang_dans_fratrie)}
Drépanocytaires/fratrie : ${cleanText(patient.nombre_de_drepanocytaires_dans_fratrie)}
Assurance               : ${cleanText(patient.assurance)}


Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Centre de Santé - Programme DrepaData
`;
};

export const generateConsultationDocument = (consultation: ConsultationData, patient?: any): string => {
  return `
FICHE DE CONSULTATION
Suivi Médical - Drépanocytose


TYPE DE CONSULTATION

Type : ${consultation.consultation_type === 'initial' ? 'Consultation Initiale' : 'Consultation de Suivi'}
Date : ${formatDate(consultation.consultation_date || consultation.created_at)}


DONNÉES ADMINISTRATIVES

Région                  : ${patient?.region || 'N/A'}
Paramètres physiques    : Poids ${patient?.poids || 'N/A'} kg, Taille ${patient?.taille || 'N/A'} cm


IDENTIFICATION DU PATIENT

Nom et Prénom           : ${patient?.nom} ${patient?.prenom}
Âge                     : ${patient?.age} ans
Date de naissance       : ${patient?.date_naissance ? formatDate(patient.date_naissance) : 'N/A'}
Sexe                    : ${patient?.sexe}


ANTÉCÉDENTS MÉDICAUX

Type de drépanocytose   : ${patient?.type_de_drepanocytose}
Âge au diagnostic       : ${patient?.age_diagnostic} ans


COMPLICATIONS RÉCENTES (3 derniers mois)

Crises vaso-occlusives  : ${consultation.cvo_3_derniers_mois}
Hospitalisations        : ${consultation.hospitalisations_3_derniers_mois}
Cause d'hospitalisation : ${consultation.hospitalization_cause || 'N/A'}
Plus longue hospitalisation : ${consultation.longest_hospitalization || 'N/A'} jours


EXAMENS BIOLOGIQUES

Hématologie
  Taux d'hémoglobine    : ${consultation.taux_hemoglobine_recent || 'N/A'} g/dl
  Taux HbF              : ${consultation.taux_hbf_recent || 'N/A'} %
  Taux HbS              : ${consultation.taux_hbs_recent || 'N/A'} %
  Réticulocytes         : ${consultation.reticulocytes || 'N/A'} %
  NFS - GB              : ${consultation.nfs_gb || 'N/A'} x10³/μL
  NFS - Plaquettes      : ${consultation.nfs_pqts || 'N/A'} x10³/μL


TRAITEMENTS ACTUELS

Traitement de fond
  Hydroxyurée           : ${consultation.hydroxyurea || 'N/A'}
${consultation.hydroxyurea === 'Oui' ? `  Tolérance             : ${consultation.tolerance}
  Posologie             : ${consultation.posologie_hydroxyurea} mg/kg/jour` : ''}
${consultation.hydroxyurea === 'Non' ? `  Raisons               : ${consultation.hydroxyurea_reasons}` : ''}

Supplémentation
  Acide folique         : ${consultation.folic_acid || 'N/A'}
  Antibioprophylaxie    : ${consultation.antibio_prophylaxie || 'N/A'}

Transfusion
  Transfusion régulière : ${consultation.regular_transfusion || 'N/A'}
${consultation.regular_transfusion === 'Oui' ? `  Type                  : ${consultation.type_transfusion_sanguine}
  Fréquence (3 mois)    : ${consultation.frequence_transfusion_3mois}
  Dernière transfusion  : ${consultation.last_transfusion_date}` : ''}

  Autres traitements    : ${consultation.autres_traitements_specifiques || 'Aucun'}
  Observance            : ${consultation.observance?.join(', ') || 'N/A'}


IMPACT PSYCHOSOCIAL

Impact scolaire/professionnel : ${consultation.impact_scolaire || 'N/A'}
Participation causeries       : ${consultation.participation_causeries || 'N/A'}
Suivi psychologique           : ${consultation.suivie_psychologique || 'N/A'}
Éducation thérapeutique       : ${consultation.education_therapeutique || 'N/A'}
Visite à domicile             : ${consultation.visite_domicile || 'N/A'}
Soutien social                : ${consultation.soutien_social || 'N/A'}


PLAN DE SUIVI

Évolution               : ${consultation.evolution || 'N/A'}
Prochaine consultation  : ${consultation.date_prochaine_consultation_plan ? formatDate(consultation.date_prochaine_consultation_plan) : 'Non définie'}

Examens avant prochaine consultation :
${consultation.examens_avant_consultation?.map((ex, i) => `  ${i + 1}. ${ex}`).join('\n') || '  Aucun examen prescrit'}

Commentaires
${consultation.commentaires || 'Aucun commentaire'}


Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Centre de Santé - Programme DrepaData
`;
};

export const generateFollowUpDocument = (followUp: FollowUpData): string => {
  return `
FICHE DE SUIVI N°${followUp.follow_up_number}
Consultation de Suivi - Drépanocytose

Date du suivi : ${formatDate(followUp.follow_up_date)}


MESURES ANTHROPOMÉTRIQUES

Poids                   : ${followUp.poids || 'N/A'} kg
Taille                  : ${followUp.taille || 'N/A'} cm
${followUp.poids && followUp.taille ? `IMC                     : ${(Number(followUp.poids) / Math.pow(Number(followUp.taille) / 100, 2)).toFixed(1)} kg/m²` : ''}


COMPLICATIONS RÉCENTES

Période évaluée : 3 derniers mois

Crises vaso-occlusives  : ${followUp.cvo_3_derniers_mois || 'N/A'}
Hospitalisations        : ${followUp.hospitalisations_3_derniers_mois || 'N/A'}
Cause principale        : ${followUp.hospitalization_cause || 'Aucune'}


EXAMENS BIOLOGIQUES

Hématologie
  Hémoglobine totale    : ${followUp.taux_hemoglobine_recent || 'N/A'} g/dl
  HbF (Hb fœtale)       : ${followUp.taux_hbf_recent || 'N/A'} %
  HbS (Hb S)            : ${followUp.taux_hbs_recent || 'N/A'} %
  Réticulocytes         : ${followUp.reticulocytes || 'N/A'} %

Numération formule sanguine
  Globules blancs       : ${followUp.nfs_gb || 'N/A'} x10³/μL
  Hémoglobine           : ${followUp.nfs_hb || 'N/A'} g/dL
  Plaquettes            : ${followUp.nfs_pqts || 'N/A'} x10³/μL

Fonction rénale
  Microalbuminurie      : ${followUp.microalbuminuria || 'N/A'}


TRAITEMENTS EN COURS

Traitement de fond
  Hydroxyurée           : ${followUp.hydroxyurea || 'N/A'}
${followUp.hydroxyurea === 'Oui' ? `  Tolérance             : ${followUp.tolerance || 'N/A'}
  Posologie             : ${followUp.posologie_hydroxyurea || 'N/A'} mg/kg/jour` : ''}

Supplémentation
  Acide folique         : ${followUp.folic_acid || 'N/A'}
  Antibioprophylaxie    : ${followUp.antibio_prophylaxie || 'N/A'}

Transfusion sanguine
  Transfusion régulière : ${followUp.regular_transfusion || 'N/A'}
${followUp.regular_transfusion === 'Oui' ? `  Type de transfusion   : ${followUp.type_transfusion_sanguine || 'N/A'}
  Fréquence (3 mois)    : ${followUp.frequence_transfusion_3mois || 'N/A'}
  Dernière transfusion  : ${followUp.last_transfusion_date || 'N/A'}` : ''}

  Autres traitements    : ${followUp.autres_traitements_specifiques || 'Aucun'}

Observance thérapeutique
  ${followUp.observance?.join(', ') || 'Non évaluée'}


SUIVI PSYCHOSOCIAL

Impact scolaire/professionnel : ${followUp.impact_scolaire || 'N/A'}
Participation aux causeries   : ${followUp.participation_causeries || 'N/A'}
Suivi psychologique           : ${followUp.suivie_psychologique || 'N/A'}
Éducation thérapeutique       : ${followUp.education_therapeutique || 'N/A'}
Visite à domicile             : ${followUp.visite_domicile || 'N/A'}
Soutien social                : ${followUp.soutien_social || 'N/A'}


ÉVOLUTION ET RECOMMANDATIONS

Évolution clinique
${followUp.evolution || 'Non documentée'}

Commentaires
${followUp.commentaires || 'Aucun commentaire'}

Prochaine consultation
Date prévue : ${followUp.date_prochaine_consultation ? formatDate(followUp.date_prochaine_consultation) : 'À définir'}


Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
Centre de Santé - Programme DrepaData
`;
};

export const generateVaccinationDocument = (vaccination: VaccinationRecord): string => {
  const completedVaccinations = vaccinationSchedule.filter(item => vaccination.vaccinations[item.vaccine]);
  const completionPercentage = Math.round((completedVaccinations.length / vaccinationSchedule.length) * 100);

  return `
CALENDRIER VACCINAL DU PEV
Programme Élargi de Vaccination - Cameroun


IDENTIFICATION DU PATIENT

Nom du patient      : ${cleanText(vaccination.patient_name)}
Âge                 : ${vaccination.patient_age} ans
Date de génération  : ${new Date().toLocaleDateString('fr-FR')}
Taux de complétion  : ${completionPercentage}%


STATUT VACCINAL DÉTAILLÉ

${vaccinationSchedule.map(item => {
  const status = vaccination.vaccinations[item.vaccine];
  const statusText = status ? 'Reçu    ' : 'Non reçu';
  return `${statusText}    ${item.period.padEnd(15)} ${item.vaccine}`;
}).join('\n')}


ANALYSE STATISTIQUE

Vaccinations administrées  : ${completedVaccinations.length} / ${vaccinationSchedule.length}
Taux de couverture         : ${completionPercentage}%
Vaccinations restantes     : ${vaccinationSchedule.length - completedVaccinations.length}
Dernière mise à jour       : ${formatDate(vaccination.updated_at)}

${completionPercentage < 100 ? `
VACCINATIONS MANQUANTES

${vaccinationSchedule
  .filter(item => !vaccination.vaccinations[item.vaccine])
  .map(item => `  - ${item.vaccine} (${item.period})`)
  .join('\n')}
` : `
STATUT : Calendrier vaccinal complet
Toutes les vaccinations du PEV ont été administrées.
`}

RÉFÉRENCES

1. Programme Élargi de Vaccination (PEV), Ministère de la Santé Publique
2. Organisation Mondiale de la Santé (OMS) - Normes de vaccination
3. Calendrier vaccinal national du Cameroun


Document généré par DrepaData
Application de suivi des patients drépanocytaires
Centre de Santé - Programme DrepaData
${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
`;
};

export const generateCompletePatientDocument = (
  patient: PatientProfile,
  consultations: ConsultationData[],
  followUps: FollowUpData[],
  vaccination: VaccinationRecord | null
): string => {
  const initialConsultation = consultations.find(c => c.consultation_type === 'initial');
  const followUpConsultations = consultations.filter(c => c.consultation_type === 'follow_up');

  let document = `
################################################################################
#                                                                              #
#                        DOSSIER MÉDICAL COMPLET                               #
#                     Suivi des Patients Drépanocytaires                       #
#                                                                              #
################################################################################

PATIENT : ${cleanText(patient.nom)} ${cleanText(patient.prenom)}
NUMÉRO D'IDENTIFICATION : ${cleanText(patient.numero_identification_unique)}
DATE DE GÉNÉRATION : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

RÉSUMÉ EXÉCUTIF
---------------
• Âge : ${patient.age} ans
• Sexe : ${cleanText(patient.sexe)}
• Type de drépanocytose : ${cleanText(patient.type_de_drepanocytose)}
• Consultations : ${consultations.length}
• Suivis : ${followUps.length}
• Calendrier vaccinal : ${vaccination ? 'Enregistré' : 'Non enregistré'}

`;

  document += '\n' + generatePatientProfileDocument(patient);

  if (initialConsultation) {
    document += '\n\n';
    document += generateConsultationDocument(initialConsultation, patient);
  }

  if (followUps.length > 0) {
    document += '\n\n';
    document += `
================================================================================
                    HISTORIQUE DES SUIVIS
           ${followUps.length} consultation(s) de suivi enregistrée(s)
================================================================================
`;
    followUps.forEach((followUp, index) => {
      document += '\n';
      document += generateFollowUpDocument(followUp);
      if (index < followUps.length - 1) {
        document += '\n\n';
      }
    });
  }

  if (followUpConsultations.length > 0) {
    document += '\n\n';
    document += `
================================================================================
                    CONSULTATIONS DE SUIVI
         ${followUpConsultations.length} consultation(s) supplémentaire(s)
================================================================================
`;
    followUpConsultations.forEach((consultation, index) => {
      document += '\n';
      document += generateConsultationDocument(consultation, patient);
      if (index < followUpConsultations.length - 1) {
        document += '\n\n';
      }
    });
  }

  if (vaccination) {
    document += '\n\n';
    document += generateVaccinationDocument(vaccination);
  }

  document += `

################################################################################
                        FIN DU DOSSIER MÉDICAL
################################################################################

Document complet généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}

Application DrepaData - Suivi des patients drépanocytaires
Centre de Santé - Programme DrepaData
Ministère de la Santé Publique - Cameroun

Pour toute question concernant ce dossier, veuillez contacter :
Programme National de Lutte contre la Drépanocytose

################################################################################
`;

  return document;
};

export const generateRTFDocument = (
  patient: PatientProfile,
  consultations: ConsultationData[],
  followUps: FollowUpData[],
  vaccination: VaccinationRecord | null
): string => {
  const initialConsultation = consultations.find(c => c.consultation_type === 'initial');

  let rtf = `{\\rtf1\\ansi\\ansicpg1252\\deff0\\nouicompat\\deflang1036
{\\fonttbl{\\f0\\fnil\\fcharset0 Times New Roman;}{\\f1\\fnil\\fcharset0 Arial;}{\\f2\\fnil\\fcharset0 Calibri;}}
{\\colortbl ;\\red0\\green0\\blue128;\\red0\\green128\\blue0;\\red128\\green0\\blue0;\\red0\\green0\\blue0;\\red128\\green128\\blue128;}
{\\stylesheet
{\\s0\\f0\\fs24\\sa120 Normal;}
{\\s1\\f0\\fs48\\b\\sa480\\qc\\cf1 Title;}
{\\s2\\f0\\fs36\\b\\sa360\\cf2 Heading 1;}
{\\s3\\f0\\fs28\\b\\sa240\\cf3 Heading 2;}
{\\s4\\f0\\fs24\\b\\sa180\\cf4 Heading 3;}
}
{\\*\\generator DrepaData 1.0}
\\paperw11906\\paperh16838\\margl1417\\margr1417\\margt1417\\margb1417
\\viewkind4\\uc1

\\pard\\s1\\qc DOSSIER M\\'c9DICAL SCIENTIFIQUE\\par
\\pard\\s0\\qc\\fs32\\b Suivi des Patients Dr\\'e9panocytaires\\par
\\pard\\s0\\qc\\fs24\\b Centre de Sant\\'e9 - Programme DrepaData\\par
\\pard\\s0\\qc\\fs20 ${new Date().toLocaleDateString('fr-FR')}\\par
\\pard\\s0\\par
\\pard\\s0\\par

\\pard\\s2 R\\'c9SUM\\'c9 EX\\'c9CUTIF\\par
\\pard\\s0\\par
Patient: ${toRTFSafe(patient.nom)} ${toRTFSafe(patient.prenom)}\\par
Num\\'e9ro d'identification: ${toRTFSafe(patient.numero_identification_unique)}\\par
\\'c2ge: ${patient.age} ans | Sexe: ${toRTFSafe(patient.sexe)}\\par
Type de dr\\'e9panocytose: ${toRTFSafe(patient.type_de_drepanocytose)}\\par
Consultations: ${consultations.length} | Suivis: ${followUps.length} | Vaccinations: ${vaccination ? 'Complete' : 'Non enregistre'}\\par
\\pard\\s0\\par
\\pard\\s0\\par

\\pard\\s2 PROFIL DU PATIENT\\par
\\pard\\s0\\par

\\pard\\s3 Informations d'identification\\par
\\pard\\s0 Num\\'e9ro d'identification unique: ${toRTFSafe(patient.numero_identification_unique)}\\par
Nom: ${toRTFSafe(patient.nom)}\\par
Pr\\'e9nom: ${toRTFSafe(patient.prenom)}\\par
Date de naissance: ${formatDate(patient.date_naissance)}\\par
\\'c2ge: ${patient.age} ans\\par
Sexe: ${toRTFSafe(patient.sexe)}\\par
\\pard\\s0\\par

\\pard\\s3 Coordonn\\'e9es\\par
\\pard\\s0 Quartier: ${toRTFSafe(patient.quartier || 'N/A')}\\par
Lieu-dit: ${toRTFSafe(patient.lieu_dit || 'N/A')}\\par
T\\'e9l\\'e9phone: ${patient.telephone_patient || 'N/A'}\\par
\\pard\\s0\\par

\\pard\\s3 Contact d'urgence\\par
\\pard\\s0 Nom: ${toRTFSafe(patient.contact_urgence_nom || 'N/A')}\\par
T\\'e9l\\'e9phone: ${patient.contact_urgence_telephone || 'N/A'}\\par
Relation: ${toRTFSafe(patient.contact_urgence_relation || 'N/A')}\\par
Vit avec le patient: ${patient.vit_avec_le_patient ? 'Oui' : 'Non'}\\par
\\pard\\s0\\par

\\pard\\s3 Informations m\\'e9dicales\\par
\\pard\\s0 Type de dr\\'e9panocytose: ${toRTFSafe(patient.type_de_drepanocytose)}\\par
\\'c2ge au diagnostic: ${patient.age_diagnostic}\\par
Circonstances du diagnostic: ${toRTFSafe(patient.circonstances_du_diagnostic)}\\par
R\\'e9gion: ${toRTFSafe(patient.region)}\\par
Groupe sanguin/Rh\\'e9sus: ${patient.groupe_sanguin_rhesus}\\par
\\pard\\s0\\par

\\pard\\s3 Ant\\'e9c\\'e9dents\\par
\\pard\\s0 Ant\\'e9c\\'e9dents familiaux: ${toRTFSafe(patient.antecedent_familiaux)}\\par
Autres ant\\'e9c\\'e9dents m\\'e9dicaux: ${toRTFSafe(patient.autres_antecedents_medicaux)}\\par
Allergies connues: ${patient.allergies_connues ? 'Oui' : 'Non'}\\par
${patient.allergies_connues ? `D\\'e9tails des allergies: ${toRTFSafe(patient.details_allergies)}\\par` : ''}\\pard\\s0\\par

\\pard\\s3 Informations sociales\\par
\\pard\\s0 Patient r\\'e9f\\'e9r\\'e9: ${patient.patient_refere ? 'Oui' : 'Non'}\\par
Appartient \\'e0 un groupe: ${patient.appartient_a_groupe ? 'Oui' : 'Non'}\\par
Rang dans la fratrie: ${patient.rang_dans_fratrie}\\par
Nombre de dr\\'e9panocytaires dans la fratrie: ${patient.nombre_de_drepanocytaires_dans_fratrie}\\par
Assurance: ${toRTFSafe(patient.assurance)}\\par
\\pard\\s0\\par`;

  if (followUps.length > 0) {
    rtf += `\\pard\\s2 3. HISTORIQUE DES SUIVIS\\par
\\pard\\s0\\par`;

    followUps.forEach((followUp, index) => {
      rtf += `\\pard\\s3 3.${index + 1} Suivi #${followUp.follow_up_number}\\par
\\pard\\s0 Date: ${formatDate(followUp.follow_up_date)}\\par
\\pard\\s0\\par

\\pard\\s4 3.${index + 1}.1 Param\\'e8tres Anthropom\\'e9triques\\par
\\pard\\s0\\par
\\trowd\\trautofit1\\intbl\\trgaph108\\trleft0
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx3000
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx6000
\\pard\\intbl\\b\\qc Param\\'e8tre\\cell\\ql Valeur\\cell\\row
\\pard\\intbl\\ql Poids\\cell\\ql ${followUp.poids || 'N/A'} kg\\cell\\row
\\pard\\intbl\\ql Taille\\cell\\ql ${followUp.taille || 'N/A'} cm\\cell\\row
\\pard\\s0\\par

\\pard\\s4 3.${index + 1}.2 Examens Biologiques\\par
\\pard\\s0\\par
\\trowd\\trautofit1\\intbl\\trgaph108\\trleft0
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx2500
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx5000
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx7500
\\pard\\intbl\\b\\qc Param\\'e8tre\\cell\\qc Valeur\\cell\\qc Unit\\'e9\\cell\\row
\\pard\\intbl\\ql H\\'e9moglobine\\cell\\qc ${followUp.taux_hemoglobine_recent || 'N/A'}\\cell\\qc g/dl\\cell\\row
\\pard\\intbl\\ql HbF\\cell\\qc ${followUp.taux_hbf_recent || 'N/A'}\\cell\\qc %\\cell\\row
\\pard\\intbl\\ql HbS\\cell\\qc ${followUp.taux_hbs_recent || 'N/A'}\\cell\\qc %\\cell\\row
\\pard\\intbl\\ql Plaquettes\\cell\\qc ${followUp.nfs_pqts || 'N/A'}\\cell\\qc x10\\'b3/\\'b5L\\cell\\row
\\pard\\intbl\\ql R\\'e9ticulocytes\\cell\\qc ${followUp.reticulocytes || 'N/A'}\\cell\\qc %\\cell\\row
\\pard\\s0\\par

\\pard\\s4 3.${index + 1}.3 Traitements\\par
\\pard\\s0\\par
\\trowd\\trautofit1\\intbl\\trgaph108\\trleft0
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx3000
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx6000
\\pard\\intbl\\b\\qc Traitement\\cell\\ql Statut\\cell\\row
\\pard\\intbl\\ql Hydroxylur\\'e9e\\cell\\ql ${followUp.hydroxyurea || 'N/A'}\\cell\\row
\\pard\\intbl\\ql Acide folique\\cell\\ql ${followUp.folic_acid || 'N/A'}\\cell\\row
\\pard\\intbl\\ql Antibioprophylaxie\\cell\\ql ${followUp.antibio_prophylaxie || 'N/A'}\\cell\\row
\\pard\\s0\\par`;
    });
  }

  if (vaccination) {
    const completionRate = Math.round((Object.values(vaccination.vaccinations).filter(Boolean).length / vaccinationSchedule.length) * 100);
    
    rtf += `\\pard\\s2 4. CALENDRIER VACCINAL\\par
\\pard\\s0\\par
Patient: ${toRTFSafe(vaccination.patient_name)}\\par
\\'c2ge: ${vaccination.patient_age} ans\\par
\\pard\\s0\\par

\\pard\\s0\\b Tableau 1: Statut vaccinal selon le Programme \\'c9largi de Vaccination (PEV)\\par
\\pard\\s0\\par

\\trowd\\trautofit1\\intbl\\trgaph108\\trleft0
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx2000
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx5000
\\clbrdrt\\brdrs\\clbrdrl\\brdrs\\clbrdrb\\brdrs\\clbrdrr\\brdrs\\cellx7000
\\pard\\intbl\\b\\qc P\\'e9riode\\cell\\qc Vaccin\\cell\\qc Statut\\cell\\row
`;

    vaccinationSchedule.forEach(item => {
      const status = vaccination.vaccinations[item.vaccine] ? 'Recu' : 'Non recu';
      rtf += `\\pard\\intbl\\qc ${toRTFSafe(item.period)}\\cell\\ql ${toRTFSafe(item.vaccine)}\\cell\\qc ${status}\\cell\\row
`;
    });

    rtf += `\\pard\\s0\\par
\\pard\\s0\\b R\\'e9sum\\'e9 vaccinal:\\par
\\pard\\s0 Vaccinations re\\'e7ues: ${Object.values(vaccination.vaccinations).filter(Boolean).length}/${vaccinationSchedule.length}\\par
Taux de compl\\'e9tion: ${completionRate}\\%\\par
Derni\\'e8re mise \\'e0 jour: ${formatDate(vaccination.updated_at)}\\par
\\pard\\s0\\par`;
  }

  rtf += `\\pard\\s0\\par
\\pard\\s2 R\\'c9F\\'c9RENCES\\par
\\pard\\s0\\par
1. Programme National de Lutte contre la Dr\\'e9panocytose, Minist\\'e8re de la Sant\\'e9 Publique, Cameroun\\par
2. Organisation Mondiale de la Sant\\'e9 (OMS). Directives pour la prise en charge de la dr\\'e9panocytose\\par
3. Programme \\'c9largi de Vaccination (PEV), Cameroun\\par
\\pard\\s0\\par
\\pard\\s0\\qc\\b Document g\\'e9n\\'e9r\\'e9 par DrepaData\\par
\\pard\\s0\\qc Application de suivi des patients dr\\'e9panocytaires\\par
\\pard\\s0\\qc ${new Date().toLocaleDateString('fr-FR')} \\'e0 ${new Date().toLocaleTimeString('fr-FR')}\\par
\\pard\\s0\\qc Centre de Sant\\'e9 - Programme DrepaData\\par
}`;

  return rtf;
};

export const shareDocument = async (content: string, title: string): Promise<void> => {
  try {
    if (Platform.OS !== 'web') {
      await Share.share({
        message: content,
        title: title,
      });
    } else {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
};

export const exportDocumentAsFile = async (
  content: string,
  fileName: string,
  format: 'txt' | 'doc' | 'html' | 'rtf'
): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      let mimeType: string;
      let extension: string;
      let finalContent: string;

      switch (format) {
        case 'html':
          mimeType = 'text/html;charset=utf-8';
          extension = 'html';
          finalContent = content;
          break;
        case 'rtf':
          mimeType = 'application/rtf';
          extension = 'rtf';
          finalContent = content;
          break;
        case 'doc':
          mimeType = 'application/msword;charset=utf-8';
          extension = 'doc';
          finalContent = '\ufeff' + content;
          break;
        default:
          mimeType = 'text/plain;charset=utf-8';
          extension = 'txt';
          finalContent = '\ufeff' + content;
      }

      const blob = new Blob([finalContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const fileUri = `${FileSystem.documentDirectory}${fileName}.${format}`;
      await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: format === 'rtf' ? 'application/rtf' : 'text/plain',
          dialogTitle: 'Exporter le document',
        });
      }
    }
  } catch (error) {
    console.error('Error exporting document:', error);
    throw error;
  }
};

export const exportPatientProfileAsFile = async (patient: PatientProfile, format: 'txt' | 'doc' = 'doc'): Promise<void> => {
  const content = generatePatientProfileDocument(patient);
  const fileName = `Profil_${cleanText(patient.nom)}_${cleanText(patient.prenom)}_${Date.now()}`;
  await exportDocumentAsFile(content, fileName, format);
};

export const exportConsultationAsFile = async (consultation: ConsultationData, patient?: any, format: 'txt' | 'doc' = 'doc'): Promise<void> => {
  const content = generateConsultationDocument(consultation, patient);
  const fileName = `Consultation_${patient?.nom}_${patient?.prenom}_${Date.now()}`;
  await exportDocumentAsFile(content, fileName, format);
};

export const exportFollowUpAsFile = async (followUp: FollowUpData, format: 'txt' | 'doc' = 'doc'): Promise<void> => {
  const content = generateFollowUpDocument(followUp);
  const fileName = `Suivi_${followUp.follow_up_number}_${Date.now()}`;
  await exportDocumentAsFile(content, fileName, format);
};

export const exportVaccinationAsFile = async (vaccination: VaccinationRecord, format: 'txt' | 'doc' = 'doc'): Promise<void> => {
  const content = generateVaccinationDocument(vaccination);
  const fileName = `Vaccination_${cleanText(vaccination.patient_name)}_${Date.now()}`;
  await exportDocumentAsFile(content, fileName, format);
};

export const exportCompletePatientAsFile = async (
  patient: PatientProfile,
  consultations: ConsultationData[],
  followUps: FollowUpData[],
  vaccination: VaccinationRecord | null,
  format: 'txt' | 'doc' | 'html' | 'rtf' = 'rtf'
): Promise<void> => {
  let content: string;
  const fileName = `Dossier_Complet_${cleanText(patient.nom)}_${cleanText(patient.prenom)}_${Date.now()}`;

  if (format === 'rtf') {
    content = generateRTFDocument(patient, consultations, followUps, vaccination);
  } else if (format === 'html') {
    content = generateFormattedHTMLDocument(patient, consultations, followUps, vaccination);
  } else {
    content = generateCompletePatientDocument(patient, consultations, followUps, vaccination);
  }

  await exportDocumentAsFile(content, fileName, format);
};

export const generateFormattedHTMLDocument = (
  patient: PatientProfile,
  consultations: ConsultationData[],
  followUps: FollowUpData[],
  vaccination?: VaccinationRecord | null
): string => {
  const initialConsultation = consultations.find(c => c.consultation_type === 'initial');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dossier Médical - ${cleanText(patient.nom)} ${cleanText(patient.prenom)}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px;
            margin-bottom: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .section {
            background: white;
            margin-bottom: 20px;
            border-radius: 8px;
            padding: 25px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .section h2 {
            color: #dc3545;
            border-bottom: 3px solid #dc3545;
            padding-bottom: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #dc3545;
        }
        .vaccination-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .vaccination-table th,
        .vaccination-table td {
            border: 1px solid #dee2e6;
            padding: 12px;
            text-align: left;
        }
        .vaccination-table th {
            background: #dc3545;
            color: white;
        }
        .received { color: #28a745; font-weight: bold; }
        .not-received { color: #dc3545; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DOSSIER MÉDICAL COMPLET</h1>
        <p>Patient: ${cleanText(patient.nom)} ${cleanText(patient.prenom)} - ID: ${cleanText(patient.numero_identification_unique)}</p>
    </div>

    <div class="section">
        <h2>👤 Informations Personnelles</h2>
        <div class="info-grid">
            <div class="info-item">
                <strong>Nom complet:</strong> ${cleanText(patient.nom)} ${cleanText(patient.prenom)}
            </div>
            <div class="info-item">
                <strong>Âge:</strong> ${patient.age} ans
            </div>
            <div class="info-item">
                <strong>Sexe:</strong> ${cleanText(patient.sexe)}
            </div>
            <div class="info-item">
                <strong>Type de drépanocytose:</strong> ${cleanText(patient.type_de_drepanocytose)}
            </div>
        </div>
    </div>

    ${followUps.length > 0 ? `
    <div class="section">
        <h2>📅 Historique des Suivis</h2>
        ${followUps.map((followUp) => `
        <div style="border: 1px solid #dee2e6; padding: 15px; margin: 10px 0; border-radius: 5px;">
            <h3>Suivi #${followUp.follow_up_number} - ${formatDate(followUp.follow_up_date)}</h3>
            <p><strong>Poids:</strong> ${followUp.poids || 'N/A'} kg | <strong>Taille:</strong> ${followUp.taille || 'N/A'} cm</p>
            <p><strong>Hémoglobine:</strong> ${followUp.taux_hemoglobine_recent || 'N/A'} g/dl</p>
            <p><strong>Hydroxyurée:</strong> ${followUp.hydroxyurea || 'N/A'}</p>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${vaccination ? `
    <div class="section">
        <h2>💉 Calendrier Vaccinal</h2>
        <table class="vaccination-table">
            <thead>
                <tr>
                    <th>Période</th>
                    <th>Vaccin</th>
                    <th>Statut</th>
                </tr>
            </thead>
            <tbody>
                ${vaccinationSchedule.map(item => `
                <tr>
                    <td>${item.period}</td>
                    <td>${item.vaccine}</td>
                    <td class="${vaccination.vaccinations[item.vaccine] ? 'received' : 'not-received'}">
                        ${vaccination.vaccinations[item.vaccine] ? 'Reçu' : 'Non reçu'}
                    </td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}

    <div style="text-align: center; margin-top: 40px; padding: 20px; background: #343a40; color: white; border-radius: 8px;">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
        <p>Application DrepaData - Suivi des patients drépanocytaires</p>
    </div>
</body>
</html>
  `;
};