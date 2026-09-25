import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new user (Student or Verifier/Admin)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role, username } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password.',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check existing email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Generate clean username if not specified
    let finalUsername = username
      ? username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
      : email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');

    const existingUsername = await User.findOne({ username: finalUsername });
    if (existingUsername) {
      finalUsername = `${finalUsername}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Default to 'student' if role is not verifier or admin
    let userRole = 'student';
    if (role && ['student', 'verifier', 'admin'].includes(role.toLowerCase())) {
      userRole = role.toLowerCase();
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      username: finalUsername,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        profilePhoto: user.profilePhoto,
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found with this email.',
      });
    }

    // Match password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        profilePhoto: user.profilePhoto,
        profileCompletion: user.profileCompletion,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        profilePhoto: user.profilePhoto,
        phone: user.phone,
        college: user.college,
        degree: user.degree,
        branch: user.branch,
        graduationYear: user.graduationYear,
        location: user.location,
        bio: user.bio,
        linkedin: user.linkedin,
        github: user.github,
        portfolio: user.portfolio,
        profileCompletion: user.profileCompletion,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear session
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new passwords.',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
