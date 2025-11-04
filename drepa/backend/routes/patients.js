const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

// GET all patients
router.get('/', async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET patient by ID
router.get('/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ id: req.params.id });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new patient
router.post('/', async (req, res) => {
  const patient = new Patient(req.body);
  try {
    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update patient
router.put('/:id', async (req, res) => {
  try {
    const updatedPatient = await Patient.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!updatedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE patient
router.delete('/:id', async (req, res) => {
  try {
    const deletedPatient = await Patient.findOneAndDelete({ id: req.params.id });
    if (!deletedPatient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET search patients
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const patients = await Patient.find({
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } },
        { numero_identification_unique: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
