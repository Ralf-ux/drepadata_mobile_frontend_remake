const express = require('express');
const router = express.Router();
const Vaccination = require('../models/Vaccination');

// GET all vaccinations
router.get('/', async (req, res) => {
  try {
    const vaccinations = await Vaccination.find();
    res.json(vaccinations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vaccination by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const vaccination = await Vaccination.findOne({ patient_id: req.params.patientId });
    if (!vaccination) return res.status(404).json({ message: 'Vaccination record not found' });
    res.json(vaccination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET vaccination by ID
router.get('/:id', async (req, res) => {
  try {
    const vaccination = await Vaccination.findOne({ id: req.params.id });
    if (!vaccination) return res.status(404).json({ message: 'Vaccination not found' });
    res.json(vaccination);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new vaccination record
router.post('/', async (req, res) => {
  const vaccination = new Vaccination(req.body);
  try {
    const newVaccination = await vaccination.save();
    res.status(201).json(newVaccination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update vaccination record
router.put('/:id', async (req, res) => {
  try {
    const updatedVaccination = await Vaccination.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!updatedVaccination) return res.status(404).json({ message: 'Vaccination not found' });
    res.json(updatedVaccination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE vaccination record
router.delete('/patient/:patientId', async (req, res) => {
  try {
    const deletedVaccination = await Vaccination.findOneAndDelete({ patient_id: req.params.patientId });
    if (!deletedVaccination) return res.status(404).json({ message: 'Vaccination record not found' });
    res.json({ message: 'Vaccination record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
