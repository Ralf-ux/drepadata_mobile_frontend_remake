const Consultation = require('../models/Consultation');
const { validationResult } = require('express-validator');

// Create a new consultation
exports.createConsultation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const consultation = new Consultation(req.body);
    await consultation.save();

    res.status(201).json({
      success: true,
      message: 'Consultation created successfully',
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

// Get all consultations with optional filters
exports.getAllConsultations = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-consultation_date',
      patient_id,
      consultation_type
    } = req.query;

    let query = {};
    if (patient_id) query.patient_id = patient_id;
    if (consultation_type) query.consultation_type = consultation_type;

    const consultations = await Consultation.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Consultation.countDocuments(query);

    res.status(200).json({
      success: true,
      data: consultations,
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

// Get consultation by ID
exports.getConsultationById = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

// Get consultations by patient ID
exports.getConsultationsByPatientId = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ patient_id: req.params.patientId }).lean();
    res.status(200).json({
      success: true,
      data: consultations
    });
  } catch (error) {
    next(error);
  }
};

// Update consultation
exports.updateConsultation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Consultation updated successfully',
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

// Delete consultation
exports.deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByIdAndDelete(req.params.id);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
