import express from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  submitAchievementForVerification,
} from '../controllers/achievementController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getAchievements)
  .post(authorizeRoles('student'), upload.single('proof'), createAchievement);

router
  .route('/:id')
  .get(getAchievementById)
  .put(authorizeRoles('student'), upload.single('proof'), updateAchievement)
  .delete(authorizeRoles('student'), deleteAchievement);

router.post('/:id/submit', authorizeRoles('student'), upload.single('proof'), submitAchievementForVerification);

export default router;
