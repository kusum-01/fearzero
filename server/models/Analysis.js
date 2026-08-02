import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    overallScore: { type: Number, required: true },
    atsScore: { type: Number, required: true },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    suggestedImprovements: [String],
    grammarFeedback: [String],
    recommendedTechnologies: [String],
    suggestedProjects: [String],
  },
  { timestamps: true }
);

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
