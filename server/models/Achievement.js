import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hackathons',
        'Coding Competitions',
        'Workshops',
        'Awards',
        'Publications',
        'Academic Achievements',
        'Other',
      ],
      default: 'Hackathons',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    organization: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Achievement date is required'],
    },
    proof: {
      type: String,
      default: '',
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
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

achievementSchema.index({ title: 'text', organization: 'text', category: 'text' });

const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
