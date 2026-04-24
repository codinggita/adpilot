import express from 'express';
import { runAudit, getAuditById, getAuditHistory, applyRecommendation, dismissRecommendation, applyAll } from '../controllers/auditController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/run', runAudit);
router.get('/history', getAuditHistory);
router.get('/:auditId', getAuditById);
router.post('/:auditId/recommendations/:recId/apply', applyRecommendation);
router.post('/:auditId/recommendations/:recId/dismiss', dismissRecommendation);
router.post('/:auditId/apply-all', applyAll);

export default router;
