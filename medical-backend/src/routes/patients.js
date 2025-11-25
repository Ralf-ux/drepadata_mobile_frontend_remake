const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patientController');

const patientValidation = [
  body('nom').notEmpty().withMessage('Last name is required'),
  body('prenom').notEmpty().withMessage('First name is required'),
  body('numero_identification_unique').notEmpty().withMessage('Unique identification number is required'),
  body('sexe').isIn(['Masculin', 'Féminin']).withMessage('Invalid gender'),
  body('type_drepanocytose').isIn(['SS', 'SC', 'Sβ⁰', 'Sβ⁺', 'Autre']).withMessage('Invalid sickle cell type'),
  body('region').isIn([
    'Centre', 'Littoral', 'Ouest', 'Nord-Ouest', 'Sud-Ouest',
    'Est', 'Nord', 'Adamaoua', 'Extrême-Nord', 'Sud'
  ]).withMessage('Invalid region'),
  body('district').notEmpty().withMessage('District is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a positive number')
];

router.post('/patients', patientValidation, patientController.createPatient);
router.get('/patients', patientController.getAllPatients);
router.get('/patients/:id', patientController.getPatientById);
router.put('/patients/:id', patientValidation, patientController.updatePatient);
router.patch('/patients/:id', patientValidation, patientController.updatePatient);
router.delete('/patients/:id', patientController.deletePatient);

// Additional routes for statistics and search
router.get('/patients/stats/overview', patientController.getPatientStats);
router.get('/patients/search/query', patientController.searchPatients);
router.get('/patients/identities/all', patientController.getPatientIdentities);

module.exports = router;