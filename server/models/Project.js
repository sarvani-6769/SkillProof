import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    projectDuration: {
      type: String,
      default: '',
      trim: true,
    },
    projectRole: {
      type: String,
      default: '',
      trim: true,
    },
    proof: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['Not Submitted', 'Pending', 'Under Review', 'Verified', 'Rejected'],
      default: 'Not Submitted',
    },
    verificationRemarks: {
      type: String,
      default: '',
    },
    verifiedAt: {
      type: Date,
      default: null,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ title: 'text', description: 'text', technologies: 'text' });

const Project = mongoose.model('Project', projectSchema);
export default Project;
