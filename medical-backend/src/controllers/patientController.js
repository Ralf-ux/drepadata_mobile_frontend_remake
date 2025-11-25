const Patient = require('../models/Patient');
const { validationResult } = require('express-validator');

// Create a new patient
exports.createPatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    if (req.body.vaccins_naissance && typeof req.body.vaccins_naissance === 'object') {
      req.body.vaccins_naissance = JSON.stringify(req.body.vaccins_naissance);
    }

    const patient = new Patient(req.body);
    await patient.save();

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: patient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this identification number already exists',
        error: error.message
      });
    }
    next(error);
  }
};

// Get all patients
exports.getAllPatients = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search = '',
      region = '',
      type_drepanocytose = ''
    } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { numero_identification_unique: { $regex: search, $options: 'i' } }
      ];
    }

    if (region) {
      query.region = region;
    }

    if (type_drepanocytose) {
      query.type_drepanocytose = type_drepanocytose;
    }

    const patients = await Patient.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Patient.countDocuments(query);

    res.status(200).json({
      success: true,
      data: patients,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get patient by ID
exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// Update patient
exports.updatePatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    if (req.body.vaccins_naissance && typeof req.body.vaccins_naissance === 'object') {
      req.body.vaccins_naissance = JSON.stringify(req.body.vaccins_naissance);
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient updated successfully',
      data: patient
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Patient with this identification number already exists',
        error: error.message
      });
    }
    next(error);
  }
};

// Delete patient
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get patient statistics
exports.getPatientStats = async (req, res, next) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const patientsByType = await Patient.aggregate([
      {
        $group: {
          _id: '$type_drepanocytose',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const patientsByRegion = await Patient.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 }
        }
      }
    ]);

    const patientsByGender = await Patient.aggregate([
      {
        $group: {
          _id: '$sexe',
          count: { $sum: 1 }
        }
      }
    ]);

    const ageDistribution = await Patient.aggregate([
      {
        $project: {
          ageGroup: {
            $switch: {
              branches: [
                { case: { $lt: ['$age', 5] }, then: '0-4' },
                { case: { $lt: ['$age', 12] }, then: '5-11' },
                { case: { $lt: ['$age', 18] }, then: '12-17' },
                { case: { $lt: ['$age', 30] }, then: '18-29' },
                { case: { $gte: ['$age', 30] }, then: '30+' }
              ],
              default: 'Unknown'
            }
          }
        }
      },
      {
        $group: {
          _id: '$ageGroup',
          count: { $sum: 1 }
        }
      }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPatients = await Patient.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        patientsByType,
        patientsByRegion,
        patientsByGender,
        ageDistribution,
        recentPatients
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search patients
exports.searchPatients = async (req, res, next) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const patients = await Patient.find({
      $or: [
        { nom: { $regex: query, $options: 'i' } },
        { prenom: { $regex: query, $options: 'i' } },
        { numero_identification_unique: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.status(200).json({
      success: true,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// Get patient identities for dropdowns
exports.getPatientIdentities = async (req, res, next) => {
  try {
    const patients = await Patient.find({}, {
      nom: 1,
      prenom: 1,
      numero_identification_unique: 1,
      sexe: 1,
      type_drepanocytose: 1,
      date_diagnostic: 1,
      age: 1
    }).lean();

    const identities = patients.map(patient => ({
      id: patient._id,
      nom: patient.nom,
      prenom: patient.prenom,
      numero_identification_unique: patient.numero_identification_unique,
      sexe: patient.sexe,
      type_de_drepanocytose: patient.type_drepanocytose,
      date_du_diagnostic: patient.date_diagnostic,
      age: patient.age
    }));

    res.status(200).json({
      success: true,
      data: identities
    });
  } catch (error) {
    next(error);
  }
};
