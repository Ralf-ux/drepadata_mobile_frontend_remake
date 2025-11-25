const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const followUpController = require('../controllers/followupController');

const followUpValidation = [
  body('patient_id').notEmpty().withMessage('Patient ID is required'),
  body('followup_date').optional().isISO8601().toDate()
];

router.post('/follow-ups', followUpValidation, followUpController.createFollowUp);
router.get('/follow-ups', followUpController.getAllFollowUps);
router.get('/follow-ups/:id', followUpController.getFollowUpById);
router.get('/follow-ups/patient/:patientId', followUpController.getFollowUpsByPatientId);
router.put('/follow-ups/:id', followUpValidation, followUpController.updateFollowUp);
router.patch('/follow-ups/:id', followUpValidation, followUpController.updateFollowUp);
router.delete('/follow-ups/:id', followUpController.deleteFollowUp);

module.exports = router;
