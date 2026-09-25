import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: [
        'Programming',
        'Web Development',
        'Database',
        'Data Science',
        'AI/ML',
        'Cloud',
        'Tools',
        'Soft Skills',
        'Other',
      ],
      default: 'Programming',
    },
    proficiency: {
      type: String,
      required: [true, 'Proficiency level is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate',
    },
    verificationStatus: {
      type: String,
      enum: ['Not Submitted', 'Pending', 'Under Review', 'Verified', 'Rejected'],
      default: 'Not Submitted',
    },
    proof: {
      type: String,
      default: '',
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

skillSchema.index({ name: 'text', category: 'text' });

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
