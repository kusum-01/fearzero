import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getOverview,
  getHistory,
  getSkillRadar,
  getWeeklyChart,
  getTimeline,
  getFeedback,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/overview', protect, getOverview);
router.get('/history', protect, getHistory);
router.get('/skill-radar', protect, getSkillRadar);
router.get('/weekly', protect, getWeeklyChart);
router.get('/timeline', protect, getTimeline);
router.get('/feedback', protect, getFeedback);

export default router;
