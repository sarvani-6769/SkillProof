import Skill from '../models/Skill.js';
import VerificationRequest from '../models/VerificationRequest.js';

// @desc    Get all skills for logged in student
// @route   GET /api/skills
// @access  Private (Student)
export const getSkills = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = { userId: req.user._id };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const skills = await Skill.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a new skill
// @route   POST /api/skills
// @access  Private (Student)
export const createSkill = async (req, res, next) => {
  try {
    const { name, category, proficiency } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    let proof = '';
    if (req.file) {
      proof = `/uploads/${req.file.filename}`;
    }

    const skill = await Skill.create({
      userId: req.user._id,
      name: name.trim(),
      category: category || 'Programming',
      proficiency: proficiency || 'Intermediate',
      proof,
      verificationStatus: 'Not Submitted',
    });

    return res.status(201).json({
      success: true,
      message: 'Skill added successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private (Student)
export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOne({ _id: id, userId: req.user._id });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const { name, category, proficiency } = req.body;
    if (name) skill.name = name.trim();
    if (category) skill.category = category;
    if (proficiency) skill.proficiency = proficiency;

    if (req.file) {
      skill.proof = `/uploads/${req.file.filename}`;
    }

    await skill.save();

    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private (Student)
export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Clean up any verification requests associated with this skill
    await VerificationRequest.deleteMany({ itemId: id });

    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit skill for verification
// @route   POST /api/skills/:id/submit
// @access  Private (Student)
export const submitSkillForVerification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findOne({ _id: id, userId: req.user._id });

    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    if (req.file) {
      skill.proof = `/uploads/${req.file.filename}`;
    }

    skill.verificationStatus = 'Pending';
    skill.verificationRemarks = '';
    await skill.save();

    // Create or update VerificationRequest
    await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId: skill._id, itemType: 'Skill' },
      {
        userId: req.user._id,
        itemId: skill._id,
        itemType: 'Skill',
        itemTitle: skill.name,
        proof: skill.proof,
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
      message: 'Skill submitted for verification successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};
