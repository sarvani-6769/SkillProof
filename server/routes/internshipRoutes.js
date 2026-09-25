import express from 'express';
import {
  getInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship,
  submitInternshipForVerification,
} from '../controllers/internshipController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getInternships)
  .post(authorizeRoles('student'), upload.single('proof'), createInternship);

router
  .route('/:id')
  .get(getInternshipById)
  .put(authorizeRoles('student'), upload.single('proof'), updateInternship)
  .delete(authorizeRoles('student'), deleteInternship);

router.post('/:id/submit', authorizeRoles('student'), upload.single('proof'), submitInternshipForVerification);

export default router;
