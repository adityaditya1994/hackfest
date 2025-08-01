import { Router } from 'express';
import { getDashboardMetrics, getAgeMixData, getSeniorityMixData } from '../controllers/dashboard.controller';

const router = Router();

router.get('/metrics', getDashboardMetrics);
router.get('/age-mix', getAgeMixData);
router.get('/seniority-mix', getSeniorityMixData);

export default router; 