const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  consultation_type: {
    type: String,
    enum: ['initial', 'follow_up'],
    required: true,
    default: 'initial'
  },
  consultation_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  fosa: {
    type: String,
    trim: true
  },
  fosa_other: {
    type: String,
    trim: true
  },
  region: {
    type: String,
    required: true,
    enum: [
      'Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest',
      'Est', 'Nord', 'Adamaoua', 'Extrême-Nord', 'Sud'
    ]
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  diagnostic_date: {
    type: Date
  },
  ipp: {
    type: String,
    trim: true
  },
  personnel: {
    type: String,
    trim: true
  },
  personnel_remplissant: {
    type: String,
    enum: ['Medecin', 'Infirmier', 'APS', 'Laborantin', 'Autres'],
    trim: true
  },
  poids: {
    type: Number,
    min: 0
  },
  taille: {
    type: Number,
    min: 0
  },
  referred: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  referred_from: {
    type: String,
    trim: true
  },
  referred_from_other: {
    type: String,
    trim: true
  },
  referred_for: {
    type: String,
    trim: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: String,
    required: true,
    trim: true
  },
  birth_date: {
    type: Date
  },
  sex: {
    type: String,
    enum: ['Masculin', 'Féminin'],
    required: true
  },
  quartier: {
    type: String,
    trim: true
  },
  lieu_dit: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  emergency_contact_name: {
    type: String,
    trim: true
  },
  emergency_contact_relation: {
    type: String,
    trim: true
  },
  emergency_contact_phone: {
    type: String,
    trim: true
  },
  patient_phone: {
    type: String,
    trim: true
  },
  patient_phone_number: {
    type: String,
    trim: true
  },
  lives_with: {
    type: String,
    trim: true
  },
  vit_avec_patient: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  lien_avec_patient: {
    type: String,
    trim: true
  },
  insurance: {
    type: String,
    trim: true
  },
  insurance_other: {
    type: String,
    trim: true
  },
  support_group: {
    type: String,
    trim: true
  },
  group_name: {
    type: String,
    trim: true
  },
  appartient_groupe: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  nom_groupe_association: {
    type: String,
    trim: true
  },
  parents: {
    type: String,
    trim: true
  },
  sibling_rank: {
    type: String,
    trim: true
  },
  rang_fratrie: {
    type: String,
    trim: true
  },
  nombre_drepanocytaire_fratrie: {
    type: String,
    trim: true
  },
  sickle_type: {
    type: String,
    enum: ['SS', 'SC', 'Sβ⁰', 'Sβ⁺', 'Autre'],
    required: true
  },
  diagnosis_age: {
    type: String,
    trim: true
  },
  diagnosis_circumstance: {
    type: String,
    trim: true
  },
  family_history: {
    type: String,
    enum: ['Oui', 'Non', 'Inconnu'],
    default: 'Inconnu'
  },
  other_medical_history: {
    type: String,
    trim: true
  },
  autres_antecedents_medicaux: {
    type: String,
    trim: true
  },
  other_medical_history_details: {
    type: String,
    trim: true
  },
  previous_surgeries: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  interventions_chirurgicales_anterieures: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  date_derniere_intervention: {
    type: Date
  },
  cause_derniere_intervention: {
    type: String,
    trim: true
  },
  acide_folique_step3: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  nombre_crises_vaso: {
    type: String,
    trim: true
  },
  allergies: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  allergies_details: {
    type: String,
    trim: true
  },
  vocs: {
    type: String,
    trim: true
  },
  cvo_3_derniers_mois: {
    type: String,
    trim: true
  },
  hospitalizations: {
    type: String,
    trim: true
  },
  hospitalisations_3_derniers_mois: {
    type: String,
    trim: true
  },
  nombre_hospitalisations_3mois: {
    type: String,
    trim: true
  },
  hospitalization_cause: {
    type: String,
    trim: true
  },
  longest_hospitalization: {
    type: String,
    trim: true
  },
  hb_1: {
    type: String,
    trim: true
  },
  hb_2: {
    type: String,
    trim: true
  },
  hb_3: {
    type: String,
    trim: true
  },
  taux_hemoglobine_recent: {
    type: String,
    trim: true
  },
  taux_hbf_recent: {
    type: String,
    trim: true
  },
  taux_hbs_recent: {
    type: String,
    trim: true
  },
  hbf_1: {
    type: String,
    trim: true
  },
  hbf_2: {
    type: String,
    trim: true
  },
  hbf_3: {
    type: String,
    trim: true
  },
  hbs_1: {
    type: String,
    trim: true
  },
  hbs_2: {
    type: String,
    trim: true
  },
  hbs_3: {
    type: String,
    trim: true
  },
  transfusion_reaction: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  reaction_types: [{
    type: String,
    trim: true
  }],
  reaction_type_other: {
    type: String,
    trim: true
  },
  allo_immunization: {
    type: String,
    trim: true
  },
  hyperviscosity: {
    type: String,
    trim: true
  },
  acute_chest_syndrome: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  acute_event: {
    type: String,
    trim: true
  },
  acute_event_details: {
    type: String,
    trim: true
  },
  stroke: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  priapism: {
    type: String,
    enum: ['Oui', 'Non', 'N/A'],
    default: 'N/A'
  },
  leg_ulcer: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  cholecystectomy: {
    type: String,
    trim: true
  },
  asplenia: {
    type: String,
    trim: true
  },
  recommended_vaccines: [{
    type: String,
    trim: true
  }],
  drug_side_effects: {
    type: String,
    trim: true
  },
  hydroxyurea: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  tolerance: {
    type: String,
    trim: true
  },
  hydroxyurea_reasons: {
    type: String,
    trim: true
  },
  hydroxyurea_dosage: {
    type: String,
    trim: true
  },
  posologie_hydroxyurea: {
    type: String,
    trim: true
  },
  folic_acid: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  antibio_prophylaxie: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  regular_transfusion: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  transfusion_type: {
    type: String,
    trim: true
  },
  type_transfusion_sanguine: {
    type: String,
    trim: true
  },
  transfusion_frequency: {
    type: String,
    trim: true
  },
  frequence_transfusion_3mois: {
    type: String,
    trim: true
  },
  last_transfusion_date: {
    type: Date
  },
  autres_traitements_specifiques: {
    type: String,
    trim: true
  },
  observance: [{
    type: String,
    trim: true
  }],
  nfs_gb: {
    type: String,
    trim: true
  },
  nfs_hb: {
    type: String,
    trim: true
  },
  nfs_pqts: {
    type: String,
    trim: true
  },
  reticulocytes: {
    type: String,
    trim: true
  },
  microalbuminuria: {
    type: String,
    enum: ['Positive', 'Négative', 'Non fait'],
    default: 'Non fait'
  },
  hemolysis: {
    type: String,
    trim: true
  },
  gs_rh: {
    type: String,
    trim: true
  },
  imagerie_medical: {
    type: String,
    trim: true
  },
  ophtalmologie: {
    type: String,
    trim: true
  },
  consultations_specialisees: {
    type: String,
    trim: true
  },
  examen_du_jour: {
    type: String,
    trim: true
  },
  impact_scolaire: {
    type: String,
    trim: true
  },
  participation_causeries: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  suivie_psychologique: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  education_therapeutique: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  consultation_psychologique: {
    type: String,
    trim: true
  },
  visite_domicile: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  soutien_social: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  soutien_social_options: [{
    type: String,
    trim: true
  }],
  impact_social: {
    type: String,
    trim: true
  },
  accompagnement_special: {
    type: String,
    trim: true
  },
  famille_informee: {
    type: String,
    enum: ['Oui', 'Partiellement', 'Non'],
    default: 'Non'
  },
  plan_suivi_personnalise: {
    type: String,
    enum: ['Oui', 'Non'],
    default: 'Non'
  },
  date_prochaine_consultation: {
    type: Date
  },
  examens_avant_consultation: [{
    type: String,
    trim: true
  }],
  evolution: {
    type: String,
    trim: true
  },
  education_therapeutique_step8: {
    type: String,
    trim: true
  },
  date_prochaine_consultation_plan: {
    type: Date
  },
  commentaires: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
consultationSchema.index({ patient_id: 1 });
consultationSchema.index({ consultation_date: -1 });
consultationSchema.index({ consultation_type: 1 });

// Populate patient information
consultationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patient_id',
    select: 'nom prenom age sexe type_drepanocytose'
  });
  next();
});

module.exports = mongoose.model('Consultation', consultationSchema);
