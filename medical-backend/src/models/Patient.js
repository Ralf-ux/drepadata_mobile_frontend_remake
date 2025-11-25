const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  numero_identification_unique: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nom: {
    type: String,
    required: true,
    trim: true
  },
  prenom: {
    type: String,
    required: true,
    trim: true
  },
  sexe: {
    type: String,
    enum: ['Masculin', 'Féminin'],
    required: true
  },
  date_naissance: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  type_drepanocytose: {
    type: String,
    enum: ['SS', 'SC', 'Sβ⁰', 'Sβ⁺', 'Autre'],
    required: true
  },
  date_diagnostic: {
    type: Date,
    required: true
  },
  age_diagnostic: {
    type: Number,
    required: true,
    min: 0
  },
  circonstances_diagnostic: {
    type: String,
    required: true
  },
  groupe_sanguin_rhesus: {
    type: String,
    enum: ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    required: true
  },
  telephone_patient: {
    type: String,
    trim: true
  },
  quartier: {
    type: String,
    trim: true
  },
  lieu_dit: {
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
  contact_urgence_nom: {
    type: String,
    trim: true
  },
  contact_urgence_telephone: {
    type: String,
    trim: true
  },
  contact_urgence_relation: {
    type: String,
    trim: true
  },
  vit_avec_le_patient: {
    type: Boolean,
    default: false
  },
  lien_avec_patient: {
    type: String,
    trim: true
  },
  antecedents_familiaux: {
    type: String,
    trim: true
  },
  antecedents_personnels: {
    type: String,
    trim: true
  },
  allergies_connues: {
    type: Boolean,
    default: false
  },
  details_allergies: {
    type: String,
    trim: true
  },
  patient_refere: {
    type: Boolean,
    default: false
  },
  patient_refere_de: {
    type: String,
    trim: true
  },
  patient_refere_pour: {
    type: String,
    trim: true
  },
  appartient_a_groupe: {
    type: Boolean,
    default: false
  },
  nom_du_groupe: {
    type: String,
    trim: true
  },
  rang_fratrie: {
    type: Number,
    min: 1
  },
  nb_enfants_drepanocytaires: {
    type: Number,
    min: 0
  },
  assurance: {
    type: String,
    trim: true
  },
  vaccins_naissance: {
    type: String, // JSON string for flexibility
    default: '{}'
  },
  fosa: {
    type: String,
    trim: true
  },
  fosa_other: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
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
  address: {
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
  sickle_type: {
    type: String,
    trim: true
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
    trim: true
  },
  other_medical_history: {
    type: String,
    trim: true
  },
  other_medical_history_details: {
    type: String,
    trim: true
  },
  previous_surgeries: {
    type: String,
    trim: true
  },
  interventions_chirurgicales_anterieures: {
    type: String,
    trim: true
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
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
patientSchema.virtual('full_name').get(function() {
  return `${this.nom} ${this.prenom}`;
});

// Index for better query performance
patientSchema.index({ numero_identification_unique: 1 });
patientSchema.index({ nom: 1, prenom: 1 });
patientSchema.index({ region: 1 });
patientSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate age if date_naissance is provided
patientSchema.pre('save', function(next) {
  if (this.date_naissance && !this.age) {
    const today = new Date();
    const birthDate = new Date(this.date_naissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    this.age = age;
  }
  
  next();
});

module.exports = mongoose.model('Patient', patientSchema);
