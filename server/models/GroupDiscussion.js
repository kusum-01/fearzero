import mongoose from 'mongoose';

const gdMessageSchema = new mongoose.Schema(
  {
    speaker: {
      type: String,
      enum: ['moderator', 'participant1', 'participant2', 'participant3', 'user'],
      required: true,
    },
    speakerName: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false, timestamps: true }
);

const groupDiscussionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    messages: [gdMessageSchema],
    summary: {
      overallScore: Number,
      communication: Number,
      confidence: Number,
      criticalThinking: Number,
      leadership: Number,
      relevance: Number,
      vocabulary: Number,
      fluency: Number,
      participation: Number,
      strengths: [String],
      weaknesses: [String],
      detailedFeedback: String,
      improvementSuggestions: [String],
    },
  },
  { timestamps: true }
);

const GroupDiscussion = mongoose.model('GroupDiscussion', groupDiscussionSchema);

export default GroupDiscussion;
