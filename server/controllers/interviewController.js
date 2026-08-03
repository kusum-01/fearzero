import Interview from '../models/Interview.js';
import { generateNextQuestion, generateInterviewSummary } from '../services/interviewAiService.js';

export const startInterview = async (req, res, next) => {
  try {
    const interview = await Interview.create({
      user: req.user._id,
      messages: [],
    });

    const firstQuestion = await generateNextQuestion([]);

    interview.messages.push({ role: 'ai', content: firstQuestion });
    await interview.save();

    res.status(201).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { answer } = req.body;
    const { id } = req.params;

    if (!answer || !answer.trim()) {
      res.status(400);
      throw new Error('Answer cannot be empty');
    }

    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    if (interview.status !== 'active') {
      res.status(400);
      throw new Error('This interview has already ended');
    }

    interview.messages.push({ role: 'user', content: answer.trim() });

    const nextQuestion = await generateNextQuestion(interview.messages);
    interview.messages.push({ role: 'ai', content: nextQuestion });

    await interview.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const endInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    if (interview.status === 'completed') {
      return res.status(200).json({ success: true, data: interview });
    }

    const summary = await generateInterviewSummary(interview.messages);

    interview.summary = summary;
    interview.status = 'completed';
    await interview.save();

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const getInterview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      res.status(404);
      throw new Error('Interview not found');
    }

    res.status(200).json({
      success: true,
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};
