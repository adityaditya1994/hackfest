import { Router } from 'express';
import { getHiringRequisitions, getHiringStats, getOffers } from '../controllers/hiring.controller';

const router = Router();

// Get hiring requisitions with optional filters
router.get('/requisitions', getHiringRequisitions);

// Get hiring statistics
router.get('/stats', getHiringStats);

// Get offers with optional filters
router.get('/offers', getOffers);

export default router; 