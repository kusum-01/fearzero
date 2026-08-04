import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getTopics,
  startGd,
  submitUserTurn,
  endGd,
  getGd,
} from '../controllers/gdController.js';

const router = express.Router();

router.get('/topics', protect, getTopics);
router.post('/start', protect, startGd);
router.get('/:id', protect, getGd);
router.post('/:id/message', protect, submitUserTurn);
router.post('/:id/end', protect, endGd);

export default router;
