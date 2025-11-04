const express = require('express');
const router = express.Router();
const FollowUp = require('../models/FollowUp');

// GET all follow-ups
router.get('/', async (req, res) => {
  try {
    const followUps = await FollowUp.find();
    res.json(followUps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET follow-ups by patient ID
router.get('/patient/:patientId', async (req, res) => {
  try {
    const followUps = await FollowUp.find({ patient_id: req.params.patientId })
      .sort({ follow_up_date: 1 });
    res.json(followUps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET follow-up by ID
router.get('/:id', async (req, res) => {
  try {
    const followUp = await FollowUp.findOne({ id: req.params.id });
    if (!followUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(followUp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new follow-up
router.post('/', async (req, res) => {
  const followUp = new FollowUp(req.body);
  try {
    const newFollowUp = await followUp.save();
    res.status(201).json(newFollowUp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update follow-up
router.put('/:id', async (req, res) => {
  try {
    const updatedFollowUp = await FollowUp.findOneAndUpdate(
      { id: req.params.id },
      { ...req.body, updated_at: new Date() },
      { new: true }
    );
    if (!updatedFollowUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(updatedFollowUp);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE follow-up
router.delete('/:id', async (req, res) => {
  try {
    const deletedFollowUp = await FollowUp.findOneAndDelete({ id: req.params.id });
    if (!deletedFollowUp) return res.status(404).json({ message: 'Follow-up not found' });
    res.json({ message: 'Follow-up deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
