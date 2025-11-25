const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const vaccinationController = require('../controllers/vaccination.controller');

const vaccinationValidation = [
  body('patient_id').notEmpty().withMessage('Patient ID is required'),
  body('vaccine_name').notEmpty().withMessage('Vaccine name is required'),
  body('vaccination_date').isISO8601().toDate().withMessage('Valid vaccination date is required'),
  body('dose_number').isInt({ min: 1 }).withMessage('Dose number must be at least 1')
];

router.post('/vaccinations', vaccinationValidation, vaccinationController.createVaccination);
router.get('/vaccinations', vaccinationController.getAllVaccinations);
router.get('/vaccinations/:id', vaccinationController.getVaccinationById);
router.get('/vaccinations/patient/:patientId', vaccinationController.getVaccinationsByPatientId);
router.put('/vaccinations/:id', vaccinationValidation, vaccinationController.updateVaccination);
router.patch('/vaccinations/:id', vaccinationValidation, vaccinationController.updateVaccination);
router.delete('/vaccinations/:id', vaccinationController.deleteVaccination);

module.exports = router;
