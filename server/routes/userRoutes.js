import express from 'express';
import { getProfile, updateProfile, getUserByUsername, getAllStudents } from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.get('/students', protect, authorizeRoles('verifier', 'admin'), getAllStudents);
router.get('/:username', getUserByUsername);

export default router;
