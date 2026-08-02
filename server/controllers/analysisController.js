import Resume from '../models/Resume.js';
import Analysis from '../models/Analysis.js';
import { extractTextFromFile } from '../services/textExtractionService.js';
import { analyzeResumeText } from '../services/aiAnalysisService.js';

export const analyzeResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume) {
      res.status(404);
      throw new Error('No resume found. Please upload a resume first.');
    }

    const resumeText = await extractTextFromFile(resume.filePath, resume.fileType);

    if (!resumeText || resumeText.trim().length < 50) {
      res.status(422);
      throw new Error('Could not extract enough readable text from this resume.');
    }

    const analysisResult = await analyzeResumeText(resumeText);

    const analysis = await Analysis.create({
      user: req.user._id,
      resume: resume._id,
      ...analysisResult,
    });

    res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const getLatestAnalysis = async (req, res, next) => {
  try {
    const analysis = await Analysis.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: analysis || null,
    });
  } catch (error) {
    next(error);
  }
};
