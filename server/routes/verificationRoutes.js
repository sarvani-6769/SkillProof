import express from 'express';
import {
  submitVerification,
  getMyRequests,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getVerificationStats,
} from '../controllers/verificationController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

// Student verification endpoints
router.post('/submit', authorizeRoles('student'), upload.single('proof'), submitVerification);
router.get('/my-requests', authorizeRoles('student'), getMyRequests);

// Verifier / Admin verification endpoints
router.get('/pending', authorizeRoles('verifier', 'admin'), getPendingRequests);
router.get('/all', authorizeRoles('verifier', 'admin'), getAllRequests);
router.get('/stats', authorizeRoles('verifier', 'admin'), getVerificationStats);
router.put('/:id/approve', authorizeRoles('verifier', 'admin'), approveRequest);
router.put('/:id/reject', authorizeRoles('verifier', 'admin'), rejectRequest);

export default router;
