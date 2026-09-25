import Project from '../models/Project.js';
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

// @desc    Get all projects for logged in student
// @route   GET /api/projects
// @access  Private (Student)
export const getProjects = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'All') {
      filter.verificationStatus = status;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('userId', 'name email college username');

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Student)
export const createProject = async (req, res, next) => {
  try {
    const { title, description, technologies, githubUrl, liveUrl, projectDuration, projectRole, autoSubmit } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide project title and description.',
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

    const project = await Project.create({
      userId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      technologies: parseTechnologies(technologies),
      githubUrl: githubUrl ? githubUrl.trim() : '',
      liveUrl: liveUrl ? liveUrl.trim() : '',
      projectDuration: projectDuration ? projectDuration.trim() : '',
      projectRole: projectRole ? projectRole.trim() : '',
      proof,
      verificationStatus: status,
    });

    if (isAutoSubmit) {
      await VerificationRequest.create({
        userId: req.user._id,
        itemId: project._id,
        itemType: 'Project',
        itemTitle: project.title,
        proof: project.proof,
        status: 'Pending',
        submittedAt: new Date(),
      });
    }

    return res.status(201).json({
      success: true,
      message: isAutoSubmit ? 'Project created and submitted for verification' : 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Student)
export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const { title, description, technologies, githubUrl, liveUrl, projectDuration, projectRole } = req.body;

    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (technologies !== undefined) project.technologies = parseTechnologies(technologies);
    if (githubUrl !== undefined) project.githubUrl = githubUrl.trim();
    if (liveUrl !== undefined) project.liveUrl = liveUrl.trim();
    if (projectDuration !== undefined) project.projectDuration = projectDuration.trim();
    if (projectRole !== undefined) project.projectRole = projectRole.trim();

    if (req.file) {
      project.proof = `/uploads/${req.file.filename}`;
    }

    if (project.verificationStatus === 'Rejected') {
      project.verificationStatus = 'Not Submitted';
      project.verificationRemarks = '';
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Student)
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await VerificationRequest.deleteMany({ itemId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit project for verification
// @route   POST /api/projects/:id/submit
// @access  Private (Student)
export const submitProjectForVerification = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (req.file) {
      project.proof = `/uploads/${req.file.filename}`;
    }

    if (!project.proof && !project.githubUrl && !project.liveUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a repository link, live demo link, or documentation proof before submitting.',
      });
    }

    project.verificationStatus = 'Pending';
    project.verificationRemarks = '';
    await project.save();

    await VerificationRequest.findOneAndUpdate(
      { userId: req.user._id, itemId: project._id, itemType: 'Project' },
      {
        userId: req.user._id,
        itemId: project._id,
        itemType: 'Project',
        itemTitle: project.title,
        proof: project.proof,
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
      message: 'Project submitted for verification successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};
