import express from 'express';
import { getRules, createRule, getRuleById, updateRule, toggleRule, deleteRule, runNow, getRuleLogs, getTemplates } from '../controllers/rulesController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();
router.use(protect);

router.get('/templates', getTemplates);
router.get('/', getRules);
router.post('/', createRule);
router.get('/:ruleId', getRuleById);
router.put('/:ruleId', updateRule);
router.patch('/:ruleId/toggle', toggleRule);
router.delete('/:ruleId', deleteRule);
router.post('/:ruleId/run-now', runNow);
router.get('/:ruleId/logs', getRuleLogs);

export default router;
