import Certificate from '../models/Certificate.js';
import VerificationRequest from '../models/VerificationRequest.js';

// @desc    Get all certificates for logged in student
// @route   GET /api/certificates
// @access  Private (Student)
export const getCertificates = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const certificates = await Certificate.find(filter).sort({ issueDate: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: certificates.length,
      certificates,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Private (Student/Verifier)
export const getCertificateById = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id).populate('userId', 'name email college username');

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Private (Student)
export const createCertificate = async (req, res, next) => {
  try {
    const { title, organization, issueDate, credentialId, credentialUrl, description, autoSubmit } = req.body;

    if (!title || !organization || !issueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide certificate title, issuing organization, and issue date.',
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

    const certificate = await Certificate.create({
      userId: req.user._id,
      title: title.trim(),
      organization: organization.trim(),
      issueDate: new Date(issueDate),
      credentialId: credentialId ? credentialId.trim() : '',
      credentialUrl: credentialUrl ? credentialUrl.trim() : '',
      description: description ? description.trim() : '',
      proof,
      verificationStatus: status,
    });

    if (isAutoSubmit) {
      await VerificationRequest.create({
        userId: req.user._id,
        itemId: certificate._id,
        itemType: 'Certificate',
        itemTitle: certificate.title,
        proof: certificate.proof,
        status: 'Pending',
        submittedAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message: isAutoSubmit
        ? 'Certificate added and submitted for verification'
        : 'Certificate created successfully as draft',
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a certificate
// @route   PUT /api/certificates/:id
// @access  Private (Student)
export const updateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ _id: req.params.id, userId: req.user._id });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const { title, organization, issueDate, credentialId, credentialUrl, description } = req.body;

    if (title) certificate.title = title.trim();
    if (organization) certificate.organization = organization.trim();
    if (issueDate) certificate.issueDate = new Date(issueDate);
    if (credentialId !== undefined) certificate.credentialId = credentialId.trim();
    if (credentialUrl !== undefined) certificate.credentialUrl = credentialUrl.trim();
    if (description !== undefined) certificate.description = description.trim();

    if (req.file) {
      certificate.proof = `/uploads/${req.file.filename}`;
    }

    // If item was previously rejected and user updates, reset to draft
    if (certificate.verificationStatus === 'Rejected') {
      certificate.verificationStatus = 'Not Submitted';
      certificate.verificationRemarks = '';
    }

    await certificate.save();

    return res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      certificate,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:id
// @access  Private (Student)
export const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    await VerificationRequest.deleteMany({ itemId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit certificate for verification
// @route   POST /api/certificates/:id/submit
// @access  Private (Student)
export const submitCertificateForVerification = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({ _id: req.params.id, userId: req.user._id });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    if (req.file) {
      certificate.proof = `/uploads/${req.file.filename}`;
    }

    if (!certificate.proof && !certificate.credentialUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a proof document or provide a verifiable credential URL before submitting.',
      });
    }

    certificate.verificationStatus = 'Pending';
    certificate.verificationRemarks = '';
    await certificate.save();

    await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId: certificate._id, itemType: 'Certificate' },
      {
        userId: req.user._id,
        itemId: certificate._id,
        itemType: 'Certificate',
        itemTitle: certificate.title,
        proof: certificate.proof,
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
      message: 'Certificate submitted for verification successfully',
      certificate,
    });
  } catch (error) {
    next(error);
  }
};
