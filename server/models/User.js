import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ['student', 'verifier', 'admin'],
      default: 'student',
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    degree: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    graduationYear: {
      type: Number,
      default: null,
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    linkedin: {
      type: String,
      default: '',
      trim: true,
    },
    github: {
      type: String,
      default: '',
      trim: true,
    },
    portfolio: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating profile completion percentage
userSchema.virtual('profileCompletion').get(function () {
  const fields = [
    this.name,
    this.email,
    this.college,
    this.degree,
    this.branch,
    this.graduationYear,
    this.phone,
    this.location,
    this.bio,
    this.linkedin,
    this.github,
    this.profilePhoto,
  ];

  const filledCount = fields.filter((f) => f && f.toString().trim().length > 0).length;
  return Math.round((filledCount / fields.length) * 100);
});

// Pre-save password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Text index for fast student search
userSchema.index({ name: 'text', college: 'text', branch: 'text', degree: 'text' });

const User = mongoose.model('User', userSchema);
export default User;
