import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Internship role is required'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
    },
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    proof: {
      type: String,
      default: '', // certificate or offer letter / completion letter
    },
    companyUrl: {
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

internshipSchema.index({ company: 'text', role: 'text' });

const Internship = mongoose.model('Internship', internshipSchema);
export default Internship;
