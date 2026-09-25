import express from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  submitSkillForVerification,
} from '../controllers/skillController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getSkills)
  .post(authorizeRoles('student'), upload.single('proof'), createSkill);

router
  .route('/:id')
  .put(authorizeRoles('student'), upload.single('proof'), updateSkill)
  .delete(authorizeRoles('student'), deleteSkill);

router.post('/:id/submit', authorizeRoles('student'), upload.single('proof'), submitSkillForVerification);

export default router;
