import express from 'express';
import { getCampaigns, getCampaignById, getCampaignMetrics, pauseCampaign, enableCampaign, updateBudget } from '../controllers/campaignController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.get('/:id/metrics', getCampaignMetrics);
router.patch('/:id/pause', pauseCampaign);
router.patch('/:id/enable', enableCampaign);
router.patch('/:id/budget', updateBudget);

export default router;
