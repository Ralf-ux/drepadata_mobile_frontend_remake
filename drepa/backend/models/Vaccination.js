const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patient_id: { type: String, required: true },
  patient_name: { type: String, required: true },
  patient_age: { type: String, required: true },
  vaccinations: { type: Map, of: Boolean, required: true },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
