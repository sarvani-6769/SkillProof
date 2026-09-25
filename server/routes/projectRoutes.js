import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  submitProjectForVerification,
} from '../controllers/projectController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getProjects)
  .post(authorizeRoles('student'), upload.single('proof'), createProject);

router
  .route('/:id')
  .get(getProjectById)
  .put(authorizeRoles('student'), upload.single('proof'), updateProject)
  .delete(authorizeRoles('student'), deleteProject);

router.post('/:id/submit', authorizeRoles('student'), upload.single('proof'), submitProjectForVerification);

export default router;
