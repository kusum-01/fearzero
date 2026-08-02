import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { analyzeResume, getLatestAnalysis } from '../controllers/analysisController.js';

const router = express.Router();

router.post('/analyze', protect, analyzeResume);
router.get('/latest', protect, getLatestAnalysis);

export default router;
