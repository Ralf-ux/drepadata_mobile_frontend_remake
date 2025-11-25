const FollowUp = require('../models/FollowUp');
const { validationResult } = require('express-validator');

// Create a new follow-up
exports.createFollowUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const followUp = new FollowUp(req.body);
    await followUp.save();

    res.status(201).json({
      success: true,
      message: 'Follow-up created successfully',
      data: followUp
    });
  } catch (error) {
    next(error);
  }
};

// Get all follow-ups
exports.getAllFollowUps = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-followup_date',
      patient_id
    } = req.query;

    let query = {};
    if (patient_id) query.patient_id = patient_id;

    const followUps = await FollowUp.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) -1) * parseInt(limit))
      .lean();

    const total = await FollowUp.countDocuments(query);

    res.status(200).json({
      success: true,
      data: followUps,
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

// Get follow-up by ID
exports.getFollowUpById = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }
    res.status(200).json({
      success: true,
      data: followUp
    });
  } catch (error) {
    next(error);
  }
};

// Get follow-ups by patient ID
exports.getFollowUpsByPatientId = async (req, res, next) => {
  try {
    const followUps = await FollowUp.find({ patient_id: req.params.patientId }).lean();
    res.status(200).json({
      success: true,
      data: followUps
    });
  } catch (error) {
    next(error);
  }
};

// Update follow-up
exports.updateFollowUp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Follow-up updated successfully',
      data: followUp
    });
  } catch (error) {
    next(error);
  }
};

// Delete follow-up
exports.deleteFollowUp = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findByIdAndDelete(req.params.id);
    if (!followUp) {
      return res.status(404).json({
        success: false,
        message: 'Follow-up not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Follow-up deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
