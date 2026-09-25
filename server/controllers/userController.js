import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import Project from '../models/Project.js';
import Internship from '../models/Internship.js';
import Achievement from '../models/Achievement.js';
import VerificationRequest from '../models/VerificationRequest.js';

// @desc    Get current user profile with dashboard analytics
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Aggregate statistics for student dashboard
    const [
      totalSkills,
      verifiedSkills,
      totalCertificates,
      verifiedCertificates,
      totalProjects,
      verifiedProjects,
      totalInternships,
      verifiedInternships,
      totalAchievements,
      verifiedAchievements,
      pendingRequests,
    ] = await Promise.all([
      Skill.countDocuments({ userId: user._id }),
      Skill.countDocuments({ userId: user._id, verificationStatus: 'Verified' }),
      Certificate.countDocuments({ userId: user._id }),
      Certificate.countDocuments({ userId: user._id, verificationStatus: 'Verified' }),
      Project.countDocuments({ userId: user._id }),
      Project.countDocuments({ userId: user._id, verificationStatus: 'Verified' }),
      Internship.countDocuments({ userId: user._id }),
      Internship.countDocuments({ userId: user._id, verificationStatus: 'Verified' }),
      Achievement.countDocuments({ userId: user._id }),
      Achievement.countDocuments({ userId: user._id, verificationStatus: 'Verified' }),
      VerificationRequest.countDocuments({ userId: user._id, status: 'Pending' }),
    ]);

    // Fetch recent items for recent activity feed
    const [recentCertificates, recentProjects, recentAchievements, recentRequests] = await Promise.all([
      Certificate.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3),
      Project.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3),
      Achievement.find({ userId: user._id }).sort({ createdAt: -1 }).limit(3),
      VerificationRequest.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      success: true,
      user,
      stats: {
        totalSkills,
        verifiedSkills,
        totalCertificates,
        verifiedCertificates,
        totalProjects,
        verifiedProjects,
        totalInternships,
        verifiedInternships,
        totalAchievements,
        verifiedAchievements,
        pendingRequests,
        profileCompletion: user.profileCompletion,
      },
      recentActivity: {
        certificates: recentCertificates,
        projects: recentProjects,
        achievements: recentAchievements,
        requests: recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      phone,
      college,
      degree,
      branch,
      graduationYear,
      location,
      bio,
      linkedin,
      github,
      portfolio,
      username,
    } = req.body;

    // Check if new username is provided and unique
    if (username && username.toLowerCase().trim() !== user.username) {
      const cleanUsername = username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '');
      const existing = await User.findOne({ username: cleanUsername });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Username is already taken' });
      }
      user.username = cleanUsername;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (college !== undefined) user.college = college.trim();
    if (degree !== undefined) user.degree = degree.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (graduationYear !== undefined) user.graduationYear = graduationYear ? Number(graduationYear) : null;
    if (location !== undefined) user.location = location.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (linkedin !== undefined) user.linkedin = linkedin.trim();
    if (github !== undefined) user.github = github.trim();
    if (portfolio !== undefined) user.portfolio = portfolio.trim();

    // Check if profile photo was uploaded via multipart/form-data
    if (req.file) {
      user.profilePhoto = `/uploads/${req.file.filename}`;
    } else if (req.body.profilePhoto !== undefined) {
      user.profilePhoto = req.body.profilePhoto;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public profile of a student by username
// @route   GET /api/users/:username
// @access  Public
export const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase().trim() }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Student profile '@${username}' not found.`,
      });
    }

    // Fetch all skills, certificates, projects, internships, achievements
    const [skills, certificates, projects, internships, achievements] = await Promise.all([
      Skill.find({ userId: user._id }).sort({ proficiency: -1, name: 1 }),
      Certificate.find({ userId: user._id }).sort({ issueDate: -1 }),
      Project.find({ userId: user._id }).sort({ createdAt: -1 }),
      Internship.find({ userId: user._id }).sort({ startDate: -1 }),
      Achievement.find({ userId: user._id }).sort({ date: -1 }),
    ]);

    // Separate verified vs unverified items for clear recruiter UI
    const verifiedSkills = skills.filter((s) => s.verificationStatus === 'Verified');
    const verifiedCertificates = certificates.filter((c) => c.verificationStatus === 'Verified');
    const verifiedProjects = projects.filter((p) => p.verificationStatus === 'Verified');
    const verifiedInternships = internships.filter((i) => i.verificationStatus === 'Verified');
    const verifiedAchievements = achievements.filter((a) => a.verificationStatus === 'Verified');

    return res.status(200).json({
      success: true,
      user,
      stats: {
        totalSkills: skills.length,
        verifiedSkills: verifiedSkills.length,
        totalCertificates: certificates.length,
        verifiedCertificates: verifiedCertificates.length,
        totalProjects: projects.length,
        verifiedProjects: verifiedProjects.length,
        totalInternships: internships.length,
        verifiedInternships: verifiedInternships.length,
        totalAchievements: achievements.length,
        verifiedAchievements: verifiedAchievements.length,
      },
      skills,
      certificates,
      projects,
      internships,
      achievements,
      verifiedOnly: {
        skills: verifiedSkills,
        certificates: verifiedCertificates,
        projects: verifiedProjects,
        internships: verifiedInternships,
        achievements: verifiedAchievements,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students (for Verifier/Admin)
// @route   GET /api/users/students
// @access  Private (Verifier / Admin)
export const getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = { role: 'student' };
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { college: searchRegex },
        { branch: searchRegex },
      ];
    }

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get item counts for each student
    const studentIds = students.map((s) => s._id);
    const [skillCounts, certCounts, reqCounts] = await Promise.all([
      Skill.aggregate([
        { $match: { userId: { $in: studentIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 }, verified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'Verified'] }, 1, 0] } } } },
      ]),
      Certificate.aggregate([
        { $match: { userId: { $in: studentIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 }, verified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'Verified'] }, 1, 0] } } } },
      ]),
      VerificationRequest.aggregate([
        { $match: { userId: { $in: studentIds }, status: 'Pending' } },
        { $group: { _id: '$userId', pendingCount: { $sum: 1 } } },
      ]),
    ]);

    const enrichedStudents = students.map((s) => {
      const sObj = s.toObject();
      const sk = skillCounts.find((item) => item._id.toString() === s._id.toString());
      const cert = certCounts.find((item) => item._id.toString() === s._id.toString());
      const vReq = reqCounts.find((item) => item._id.toString() === s._id.toString());
      return {
        ...sObj,
        skillsCount: sk ? sk.count : 0,
        verifiedSkillsCount: sk ? sk.verified : 0,
        certificatesCount: cert ? cert.count : 0,
        verifiedCertificatesCount: cert ? cert.verified : 0,
        pendingRequestsCount: vReq ? vReq.pendingCount : 0,
      };
    });

    return res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      students: enrichedStudents,
    });
  } catch (error) {
    next(error);
  }
};
