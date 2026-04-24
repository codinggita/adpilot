import express from 'express';
import { getOverview, getTrends, getCampaignBreakdown } from '../controllers/analyticsController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/campaigns', getCampaignBreakdown);

export default router;
