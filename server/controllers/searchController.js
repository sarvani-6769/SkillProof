import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';

// @desc    Search student profiles by Name, Skill, College, or Technology
// @route   GET /api/search
// @access  Public
export const searchProfiles = async (req, res, next) => {
  try {
    const { q, skill, college, technology, page = 1, limit = 12 } = req.query;

    const userFilters = { role: 'student' };
    const orConditions = [];

    // General query across multiple fields
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      orConditions.push(
        { name: regex },
        { college: regex },
        { branch: regex },
        { degree: regex },
        { bio: regex },
        { username: regex }
      );
    }

    // Explicit college filter
    if (college && college.trim()) {
      userFilters.college = new RegExp(college.trim(), 'i');
    }

    let matchedUserIds = [];

    // Search by skill name
    if (skill && skill.trim()) {
      const skillsFound = await Skill.find({
        name: new RegExp(skill.trim(), 'i'),
      }).select('userId');
      const skillUserIds = skillsFound.map((s) => s.userId.toString());
      matchedUserIds.push(...skillUserIds);
    }

    // Search by technology in projects
    if (technology && technology.trim()) {
      const projectsFound = await Project.find({
        technologies: new RegExp(technology.trim(), 'i'),
      }).select('userId');
      const techUserIds = projectsFound.map((p) => p.userId.toString());
      matchedUserIds.push(...techUserIds);
    }

    if (skill || technology) {
      if (matchedUserIds.length === 0) {
        return res.status(200).json({
          success: true,
          total: 0,
          page: parseInt(page),
          pages: 0,
          profiles: [],
        });
      }
      userFilters._id = { $in: matchedUserIds };
    }

    if (orConditions.length > 0) {
      userFilters.$or = orConditions;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(userFilters);

    const students = await User.find(userFilters)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Enrich profiles with verified skills and counts
    const studentIds = students.map((s) => s._id);

    const [skillsAgg, certsAgg, projectsAgg] = await Promise.all([
      Skill.find({ userId: { $in: studentIds } }),
      Certificate.find({ userId: { $in: studentIds } }),
      Project.find({ userId: { $in: studentIds } }),
    ]);

    const enrichedProfiles = students.map((student) => {
      const sId = student._id.toString();
      const userSkills = skillsAgg.filter((s) => s.userId.toString() === sId);
      const userCerts = certsAgg.filter((c) => c.userId.toString() === sId);
      const userProjects = projectsAgg.filter((p) => p.userId.toString() === sId);

      const verifiedSkills = userSkills.filter((s) => s.verificationStatus === 'Verified');
      const verifiedCerts = userCerts.filter((c) => c.verificationStatus === 'Verified');

      return {
        ...student.toObject(),
        profileCompletion: student.profileCompletion,
        skills: userSkills.slice(0, 6),
        verifiedSkillsCount: verifiedSkills.length,
        totalSkillsCount: userSkills.length,
        verifiedCertificatesCount: verifiedCerts.length,
        totalProjectsCount: userProjects.length,
      };
    });

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      profiles: enrichedProfiles,
    });
  } catch (error) {
    next(error);
  }
};
