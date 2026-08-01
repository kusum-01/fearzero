import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadResume, getResume, deleteResume } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);
router.delete('/', protect, deleteResume);

export default router;
