import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  startInterview,
  submitAnswer,
  endInterview,
  getInterview,
} from '../controllers/interviewController.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.get('/:id', protect, getInterview);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/end', protect, endInterview);

export default router;
