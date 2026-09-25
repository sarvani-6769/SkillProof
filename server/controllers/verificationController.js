import VerificationRequest from '../models/VerificationRequest.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Achievement from '../models/Achievement.js';

// Helper to get corresponding Mongoose model by itemType
const getModelByType = (itemType) => {
  switch (itemType) {
    case 'Skill':
      return Skill;
    case 'Certificate':
      return Certificate;
    case 'Project':
      return Project;
    case 'Internship':
      return Internship;
    case 'Achievement':
      return Achievement;
    default:
      return null;
  }
};

// @desc    Submit an item for verification
// @route   POST /api/verification/submit
// @access  Private (Student)
export const submitVerification = async (req, res, next) => {
  try {
    const { itemId, itemType, itemTitle } = req.body;

    if (!itemId || !itemType) {
      return res.status(400).json({
        success: false,
        message: 'itemId and itemType are required.',
      });
    }

    const Model = getModelByType(itemType);
    if (!Model) {
      return res.status(400).json({
        success: false,
        message: `Invalid itemType: ${itemType}`,
      });
    }

    const item = await Model.findOne({ _id: itemId, userId: req.user._id });
    if (!item) {
      return res.status(404).json({
        success: false,
        message: `${itemType} not found or you are not authorized to submit it.`,
      });
    }

    let proof = item.proof || '';
    if (req.file) {
      proof = `/uploads/${req.file.filename}`;
      item.proof = proof;
    }

    item.verificationStatus = 'Pending';
    item.verificationRemarks = '';
    await item.save();

    const title = itemTitle || item.title || item.name || `${itemType} verification`;

    const request = await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId, itemType },
      {
        userId: req.user._id,
        itemId,
        itemType,
        itemTitle: title,
        proof,
        status: 'Pending',
        submittedAt: new Date(),
        remarks: '',
        reviewedBy: null,
        reviewedAt: null,
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `${itemType} submitted for verification successfully.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's own verification requests
// @route   GET /api/verification/my-requests
// @access  Private (Student)
export const getMyRequests = async (req, res, next) => {
  try {
    const requests = await VerificationRequest.find({ userId: req.user._id })
      .populate('reviewedBy', 'name email role')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending verification requests (for Verifier/Admin)
// @route   GET /api/verification/pending
// @access  Private (Verifier / Admin)
export const getPendingRequests = async (req, res, next) => {
  try {
    const { itemType } = req.query;
    const filter = { status: { $in: ['Pending', 'Under Review'] } };

    if (itemType && itemType !== 'All') {
      filter.itemType = itemType;
    }

    const requests = await VerificationRequest.find(filter)
      .populate('userId', 'name email college degree branch graduationYear username profilePhoto')
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all verification requests with filter (for Verifier/Admin)
// @route   GET /api/verification/all
// @access  Private (Verifier / Admin)
export const getAllRequests = async (req, res, next) => {
  try {
    const { status, itemType, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (itemType && itemType !== 'All') {
      filter.itemType = itemType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await VerificationRequest.countDocuments(filter);

    const requests = await VerificationRequest.find(filter)
      .populate('userId', 'name email college degree branch username profilePhoto')
      .populate('reviewedBy', 'name email')
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a verification request
// @route   PUT /api/verification/:id/approve
// @access  Private (Verifier / Admin)
export const approveRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;
    const request = await VerificationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    request.status = 'Verified';
    request.remarks = remarks || 'Approved after review';
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // Update the item itself
    const Model = getModelByType(request.itemType);
    if (Model) {
      await Model.findByIdAndUpdate(request.itemId, {
        verificationStatus: 'Verified',
        verificationRemarks: request.remarks,
        verifiedAt: new Date(),
        verifiedBy: req.user._id,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${request.itemType} has been successfully verified!`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a verification request
// @route   PUT /api/verification/:id/reject
// @access  Private (Verifier / Admin)
export const rejectRequest = async (req, res, next) => {
  try {
    const { remarks } = req.body;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a clear rejection reason or remarks to inform the student.',
      });
    }

    const request = await VerificationRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    request.status = 'Rejected';
    request.remarks = remarks.trim();
    request.reviewedBy = req.user._id;
    request.reviewedAt = new Date();
    await request.save();

    // Update the item itself
    const Model = getModelByType(request.itemType);
    if (Model) {
      await Model.findByIdAndUpdate(request.itemId, {
        verificationStatus: 'Rejected',
        verificationRemarks: request.remarks,
        verifiedAt: null,
        verifiedBy: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${request.itemType} submission has been rejected with feedback.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics for Verifier / Admin
// @route   GET /api/verification/stats
// @access  Private (Verifier / Admin)
export const getVerificationStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalSubmissions,
      pendingRequests,
      verifiedSubmissions,
      rejectedSubmissions,
      submissionsByType,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      VerificationRequest.countDocuments(),
      VerificationRequest.countDocuments({ status: { $in: ['Pending', 'Under Review'] } }),
      VerificationRequest.countDocuments({ status: 'Verified' }),
      VerificationRequest.countDocuments({ status: 'Rejected' }),
      VerificationRequest.aggregate([
        { $group: { _id: '$itemType', count: { $sum: 1 }, verified: { $sum: { $cond: [{ $eq: ['$status', 'Verified'] }, 1, 0] } } } },
      ]),
    ]);

    const recentSubmissions = await VerificationRequest.find()
      .populate('userId', 'name email college username profilePhoto')
      .populate('reviewedBy', 'name')
      .sort({ submittedAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalSubmissions,
        pendingRequests,
        verifiedSubmissions,
        rejectedSubmissions,
        submissionsByType,
      },
      recentSubmissions,
    });
  } catch (error) {
    next(error);
  }
};
