import express from 'express';
import { getReports, getReportById, generateReport } from '../controllers/reportsController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/', getReports);
router.post('/generate', generateReport);
router.get('/:reportId', getReportById);

export default router;
