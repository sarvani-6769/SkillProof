import Achievement from '../models/Achievement.js';
import VerificationRequest from '../models/VerificationRequest.js';

// @desc    Get all achievements for logged in student
// @route   GET /api/achievements
// @access  Private (Student)
export const getAchievements = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = { userId: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const achievements = await Achievement.find(filter).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      count: achievements.length,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single achievement by ID
// @route   GET /api/achievements/:id
// @access  Private
export const getAchievementById = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id).populate('userId', 'name email college username');

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    return res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Private (Student)
export const createAchievement = async (req, res, next) => {
  try {
    const { title, category, description, organization, date, credentialUrl, autoSubmit } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide achievement title and date.',
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

    const achievement = await Achievement.create({
      userId: req.user._id,
      title: title.trim(),
      category: category || 'Hackathons',
      description: description ? description.trim() : '',
      organization: organization ? organization.trim() : '',
      date: new Date(date),
      proof,
      credentialUrl: credentialUrl ? credentialUrl.trim() : '',
      verificationStatus: status,
    });

    if (isAutoSubmit) {
      await VerificationRequest.create({
        userId: req.user._id,
        itemId: achievement._id,
        itemType: 'Achievement',
        itemTitle: achievement.title,
        proof: achievement.proof,
        status: 'Pending',
        submittedAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message: isAutoSubmit ? 'Achievement added and submitted for verification' : 'Achievement added successfully',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
// @access  Private (Student)
export const updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOne({ _id: req.params.id, userId: req.user._id });

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    const { title, category, description, organization, date, credentialUrl } = req.body;

    if (title) achievement.title = title.trim();
    if (category) achievement.category = category;
    if (description !== undefined) achievement.description = description.trim();
    if (organization !== undefined) achievement.organization = organization.trim();
    if (date) achievement.date = new Date(date);
    if (credentialUrl !== undefined) achievement.credentialUrl = credentialUrl.trim();

    if (req.file) {
      achievement.proof = `/uploads/${req.file.filename}`;
    }

    if (achievement.verificationStatus === 'Rejected') {
      achievement.verificationStatus = 'Not Submitted';
      achievement.verificationRemarks = '';
    }

    await achievement.save();

    return res.status(200).json({
      success: true,
      message: 'Achievement updated successfully',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
// @access  Private (Student)
export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    await VerificationRequest.deleteMany({ itemId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit achievement for verification
// @route   POST /api/achievements/:id/submit
// @access  Private (Student)
export const submitAchievementForVerification = async (req, res, next) => {
  try {
    const achievement = await Achievement.findOne({ _id: req.params.id, userId: req.user._id });

    if (!achievement) {
      return res.status(404).json({ success: false, message: 'Achievement not found' });
    }

    if (req.file) {
      achievement.proof = `/uploads/${req.file.filename}`;
    }

    if (!achievement.proof && !achievement.credentialUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please upload certificate/proof or provide credential URL before submitting.',
      });
    }

    achievement.verificationStatus = 'Pending';
    achievement.verificationRemarks = '';
    await achievement.save();

    await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId: achievement._id, itemType: 'Achievement' },
      {
        userId: req.user._id,
        itemId: achievement._id,
        itemType: 'Achievement',
        itemTitle: achievement.title,
        proof: achievement.proof,
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
      message: 'Achievement submitted for verification successfully',
      achievement,
    });
  } catch (error) {
    next(error);
  }
};
