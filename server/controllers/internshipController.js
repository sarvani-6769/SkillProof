import Internship from '../models/Internship.js';
import VerificationRequest from '../models/VerificationRequest.js';

// Helper to parse technologies array
const parseTechnologies = (tech) => {
  if (Array.isArray(tech)) return tech.map((t) => t.trim()).filter(Boolean);
  if (typeof tech === 'string') {
    return tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

// @desc    Get all internships for logged in student
// @route   GET /api/internships
// @access  Private (Student)
export const getInternships = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const internships = await Internship.find(filter).sort({ startDate: -1 });

    return res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get internship by ID
// @route   GET /api/internships/:id
// @access  Private
export const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('userId', 'name email college username');

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    return res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new internship
// @route   POST /api/internships
// @access  Private (Student)
export const createInternship = async (req, res, next) => {
  try {
    const { company, role, startDate, endDate, currentlyWorking, description, technologies, companyUrl, autoSubmit } = req.body;

    if (!company || !role || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide company name, role, and start date.',
      });
    }

    let proof = '';
    if (req.file) {
      proof = `/uploads/${req.file.filename}`;
    } else if (req.body.proof) {
      proof = req.body.proof;
    }

    const isAutoSubmit = autoSubmit === 'true' || autoSubmit === true;
    const status = isAutoSubmit ? 'Pending' : 'Not Submitted';

    const internship = await Internship.create({
      userId: req.user._id,
      company: company.trim(),
      role: role.trim(),
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      currentlyWorking: currentlyWorking === 'true' || currentlyWorking === true,
      description: description ? description.trim() : '',
      technologies: parseTechnologies(technologies),
      companyUrl: companyUrl ? companyUrl.trim() : '',
      proof,
      verificationStatus: status,
    });

    if (isAutoSubmit) {
      await VerificationRequest.create({
        userId: req.user._id,
        itemId: internship._id,
        itemType: 'Internship',
        itemTitle: `${internship.role} at ${internship.company}`,
        proof: internship.proof,
        status: 'Pending',
        submittedAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message: isAutoSubmit ? 'Internship added and submitted for verification' : 'Internship added successfully',
      internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private (Student)
export const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, userId: req.user._id });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    const { company, role, startDate, endDate, currentlyWorking, description, technologies, companyUrl } = req.body;

    if (company) internship.company = company.trim();
    if (role) internship.role = role.trim();
    if (startDate) internship.startDate = new Date(startDate);
    if (endDate !== undefined) internship.endDate = endDate ? new Date(endDate) : null;
    if (currentlyWorking !== undefined) internship.currentlyWorking = currentlyWorking === 'true' || currentlyWorking === true;
    if (description !== undefined) internship.description = description.trim();
    if (technologies !== undefined) internship.technologies = parseTechnologies(technologies);
    if (companyUrl !== undefined) internship.companyUrl = companyUrl.trim();

    if (req.file) {
      internship.proof = `/uploads/${req.file.filename}`;
    }

    if (internship.verificationStatus === 'Rejected') {
      internship.verificationStatus = 'Not Submitted';
      internship.verificationRemarks = '';
    }

    await internship.save();

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      internship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private (Student)
export const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    await VerificationRequest.deleteMany({ itemId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit internship for verification
// @route   POST /api/internships/:id/submit
// @access  Private (Student)
export const submitInternshipForVerification = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({ _id: req.params.id, userId: req.user._id });

    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    if (req.file) {
      internship.proof = `/uploads/${req.file.filename}`;
    }

    if (!internship.proof) {
      return res.status(400).json({
        success: false,
        message: 'Please upload completion letter or certificate proof before submitting.',
      });
    }

    internship.verificationStatus = 'Pending';
    internship.verificationRemarks = '';
    await internship.save();

    await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId: internship._id, itemType: 'Internship' },
      {
        userId: req.user._id,
        itemId: internship._id,
        itemType: 'Internship',
        itemTitle: `${internship.role} at ${internship.company}`,
        proof: internship.proof,
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
      message: 'Internship submitted for verification successfully',
      internship,
    });
  } catch (error) {
    next(error);
  }
};
