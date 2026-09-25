import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Certificate title is required'],
      trim: true,
    },
    organization: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, 'Issue date is required'],
    },
    credentialId: {
      type: String,
      default: '',
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    proof: {
      type: String,
      default: '', // file path or URL
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

certificateSchema.index({ title: 'text', organization: 'text' });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
