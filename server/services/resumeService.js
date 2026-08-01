import fs from 'fs';
import Resume from '../models/Resume.js';

export const saveResumeRecord = async ({ userId, file }) => {
  const existing = await Resume.findOne({ user: userId });

  // Replace old file on disk if a previous resume exists
  if (existing && fs.existsSync(existing.filePath)) {
    fs.unlinkSync(existing.filePath);
  }

  const resumeData = {
    user: userId,
    originalName: file.originalname,
    storedFileName: file.filename,
    filePath: file.path,
    fileType: file.mimetype,
    fileSize: file.size,
  };

  if (existing) {
    Object.assign(existing, resumeData);
    return existing.save();
  }

  return Resume.create(resumeData);
};

export const deleteResumeRecord = async (userId) => {
  const resume = await Resume.findOne({ user: userId });
  if (!resume) return null;

  if (fs.existsSync(resume.filePath)) {
    fs.unlinkSync(resume.filePath);
  }

  await resume.deleteOne();
  return resume;
};
