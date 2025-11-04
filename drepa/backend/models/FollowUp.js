const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true },
  consultation_id: { type: String, required: true },
  follow_up_number: { type: Number, required: true },
  follow_up_date: { type: String, required: true },

  poids: { type: String },
  taille: { type: String },
  cvo_3_derniers_mois: { type: String },
  hospitalisations_3_derniers_mois: { type: String },
  hospitalization_cause: { type: String },
  taux_hemoglobine_recent: { type: String },
  taux_hbf_recent: { type: String },
  taux_hbs_recent: { type: String },

  hydroxyurea: { type: String },
  tolerance: { type: String },
  posologie_hydroxyurea: { type: String },
  folic_acid: { type: String },
  antibio_prophylaxie: { type: String },
  regular_transfusion: { type: String },
  type_transfusion_sanguine: { type: String },
  frequence_transfusion_3mois: { type: String },
  last_transfusion_date: { type: String },
  autres_traitements_specifiques: { type: String },
  observance: { type: [String] },

  nfs_gb: { type: String },
  nfs_hb: { type: String },
  nfs_pqts: { type: String },
  reticulocytes: { type: String },
  microalbuminuria: { type: String },

  impact_scolaire: { type: String },
  participation_causeries: { type: String },
  suivie_psychologique: { type: String },
  education_therapeutique: { type: String },
  visite_domicile: { type: String },
  soutien_social: { type: String },

  evolution: { type: String },
  commentaires: { type: String },
  date_prochaine_consultation: { type: String },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FollowUp', followUpSchema);
