const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const consultationController = require('../controllers/consultationController');

const consultationValidation = [
  body('patient_id').notEmpty().withMessage('Patient ID is required'),
  body('consultation_type').isIn(['initial', 'follow_up']).withMessage('Invalid consultation type'),
  body('consultation_date').optional().isISO8601().toDate()
];

router.post('/consultations', consultationValidation, consultationController.createConsultation);
router.get('/consultations', consultationController.getAllConsultations);
router.get('/consultations/:id', consultationController.getConsultationById);
router.get('/consultations/patient/:patientId', consultationController.getConsultationsByPatientId);
router.put('/consultations/:id', consultationValidation, consultationController.updateConsultation);
router.patch('/consultations/:id', consultationValidation, consultationController.updateConsultation);
router.delete('/consultations/:id', consultationController.deleteConsultation);

module.exports = router;
