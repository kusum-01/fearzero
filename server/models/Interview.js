import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['ai', 'user'], required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    messages: [messageSchema],
    summary: {
      overallScore: Number,
      communicationScore: Number,
      confidenceScore: Number,
      clarityScore: Number,
      professionalismScore: Number,
      strengths: [String],
      areasForImprovement: [String],
      suggestedBetterAnswers: [String],
      finalFeedback: String,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
