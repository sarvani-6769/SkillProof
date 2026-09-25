import express from 'express';
import {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  submitCertificateForVerification,
} from '../controllers/certificateController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getCertificates)
  .post(authorizeRoles('student'), upload.single('proof'), createCertificate);

router
  .route('/:id')
  .get(getCertificateById)
  .put(authorizeRoles('student'), upload.single('proof'), updateCertificate)
  .delete(authorizeRoles('student'), deleteCertificate);

router.post('/:id/submit', authorizeRoles('student'), upload.single('proof'), submitCertificateForVerification);

export default router;
