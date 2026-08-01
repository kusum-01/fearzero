import Resume from '../models/Resume.js';
import { saveResumeRecord, deleteResumeRecord } from '../services/resumeService.js';

export const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    const resume = await saveResumeRecord({ userId: req.user._id, file: req.file });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: resume || null,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const resume = await deleteResumeRecord(req.user._id);

    if (!resume) {
      res.status(404);
      throw new Error('No resume found to delete');
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
