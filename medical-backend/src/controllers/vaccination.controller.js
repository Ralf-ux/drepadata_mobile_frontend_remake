const Vaccination = require('../models/Vaccination');
const { validationResult } = require('express-validator');

// Create a new vaccination record
exports.createVaccination = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const vaccination = new Vaccination(req.body);
    await vaccination.save();

    res.status(201).json({
      success: true,
      message: 'Vaccination record created successfully',
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
};

// Get all vaccination records
exports.getAllVaccinations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-vaccination_date',
      patient_id
    } = req.query;

    let query = {};
    if (patient_id) query.patient_id = patient_id;

    const vaccinations = await Vaccination.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Vaccination.countDocuments(query);

    res.status(200).json({
      success: true,
      data: vaccinations,
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

// Get vaccination by ID
exports.getVaccinationById = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findById(req.params.id);
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }
    res.status(200).json({
      success: true,
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
};

// Get vaccinations by patient ID
exports.getVaccinationsByPatientId = async (req, res, next) => {
  try {
    const vaccinations = await Vaccination.find({ patient_id: req.params.patientId }).lean();
    res.status(200).json({
      success: true,
      data: vaccinations
    });
  } catch (error) {
    next(error);
  }
};

// Update vaccination record
exports.updateVaccination = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const vaccination = await Vaccination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Vaccination record updated successfully',
      data: vaccination
    });
  } catch (error) {
    next(error);
  }
};

// Delete vaccination record
exports.deleteVaccination = async (req, res, next) => {
  try {
    const vaccination = await Vaccination.findByIdAndDelete(req.params.id);
    if (!vaccination) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Vaccination record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
