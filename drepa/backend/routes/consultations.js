const express = require('express');
const router = express.Router();
const Consultation = require('../models/Consultation');

// GET all consultations
router.get('/', async (req, res) => {
  try {
    const consultations = await Consultation.find();
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET consultations by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const consultations = await Consultation.find({ patient_id: req.params.patientId });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET consultation by ID
router.get('/:id', async (req, res) => {
  try {
    const consultation = await Consultation.findOne({ id: req.params.id });
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new consultation
router.post('/', async (req, res) => {
  const consultation = new Consultation(req.body);
  try {
    const newConsultation = await consultation.save();
    res.status(201).json(newConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update consultation
router.put('/:id', async (req, res) => {
  try {
    const updatedConsultation = await Consultation.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!updatedConsultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json(updatedConsultation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE consultation
router.delete('/:id', async (req, res) => {
  try {
    const deletedConsultation = await Consultation.findOneAndDelete({ id: req.params.id });
    if (!deletedConsultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json({ message: 'Consultation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
