import mongoose from 'mongoose';

const verificationRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Skill', 'Certificate', 'Project', 'Internship', 'Achievement'],
    },
    itemTitle: {
      type: String,
      default: '',
    },
    proof: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Verified', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

verificationRequestSchema.index({ userId: 1, itemId: 1, itemType: 1 });

const VerificationRequest = mongoose.model('VerificationRequest', verificationRequestSchema);
export default VerificationRequest;
