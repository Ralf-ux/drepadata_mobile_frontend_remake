const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  vaccine_name: {
    type: String,
    required: true,
    trim: true
  },
  vaccination_date: {
    type: Date,
    required: true
  },
  dose_number: {
    type: Number,
    min: 1,
    required: true
  },
  lot_number: {
    type: String,
    trim: true
  },
  site: {
    type: String,
    trim: true
  },
  reactions: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

vaccinationSchema.index({ patient_id: 1, vaccination_date: -1 });

module.exports = mongoose.model('Vaccination', vaccinationSchema);
