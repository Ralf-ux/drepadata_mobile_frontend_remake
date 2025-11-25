const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  followup_date: {
    type: Date,
    required: true,
    default: Date.now
  },
  anthropometric_measurements: {
    height: Number,
    weight: Number,
    bmi: Number
  },
  recent_complications: {
    vaso_occlusive_crises: Number,
    acute_chest_syndrome: Boolean,
    stroke: Boolean,
    hospitalizations: Number
  },
  laboratory_results: {
    hemoglobin: Number,
    reticulocytes: Number,
    bilirubin: Number
  },
  current_treatments: {
    hydroxyurea: Boolean,
    folic_acid: Boolean,
    penicillin_prophylaxis: Boolean
  },
  psychosocial_assessment: {
    school_impact: String,
    psychological_followup: Boolean,
    social_support: Boolean
  },
  evolution: {
    type: String,
    trim: true
  },
  recommendations: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

followUpSchema.index({ patient_id: 1, followup_date: -1 });

module.exports = mongoose.model('FollowUp', followUpSchema);
