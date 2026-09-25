import express from 'express';
import { searchProfiles } from '../controllers/searchController.js';

const router = express.Router();

// Public search endpoint
router.get('/', searchProfiles);

export default router;
