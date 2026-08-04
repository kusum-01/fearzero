import GroupDiscussion from '../models/GroupDiscussion.js';
import {
  PARTICIPANTS,
  generateTopics,
  generateModeratorOpening,
  generateNextTurn,
  generateGdSummary,
} from '../services/gdAiService.js';

export const getTopics = async (req, res, next) => {
  try {
    const { difficulty } = req.query;

    if (!['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      res.status(400);
      throw new Error('Invalid difficulty level');
    }

    const topics = await generateTopics(difficulty);

    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const startGd = async (req, res, next) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      res.status(400);
      throw new Error('Topic and difficulty are required');
    }

    const gd = await GroupDiscussion.create({
      user: req.user._id,
      topic,
      difficulty,
      messages: [],
    });

    const openingLine = await generateModeratorOpening(topic);

    gd.messages.push({
      speaker: 'moderator',
      speakerName: PARTICIPANTS.moderator.name,
      content: openingLine,
    });

    await gd.save();

    res.status(201).json({ success: true, data: gd });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const submitUserTurn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error('Message cannot be empty');
    }

    const gd = await GroupDiscussion.findOne({ _id: id, user: req.user._id });

    if (!gd) {
      res.status(404);
      throw new Error('Discussion not found');
    }

    if (gd.status !== 'active') {
      res.status(400);
      throw new Error('This discussion has already ended');
    }

    gd.messages.push({
      speaker: 'user',
      speakerName: 'You',
      content: message.trim(),
    });

    const nextTurn = await generateNextTurn({ topic: gd.topic, messages: gd.messages });

    gd.messages.push({
      speaker: nextTurn.speaker,
      speakerName: PARTICIPANTS[nextTurn.speaker]?.name || 'Participant',
      content: nextTurn.content,
    });

    await gd.save();

    res.status(200).json({ success: true, data: gd });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const endGd = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gd = await GroupDiscussion.findOne({ _id: id, user: req.user._id });

    if (!gd) {
      res.status(404);
      throw new Error('Discussion not found');
    }

    if (gd.status === 'completed') {
      return res.status(200).json({ success: true, data: gd });
    }

    const summary = await generateGdSummary({ topic: gd.topic, messages: gd.messages });

    gd.summary = summary;
    gd.status = 'completed';
    await gd.save();

    res.status(200).json({ success: true, data: gd });
  } catch (error) {
    if (error.statusCode) res.status(error.statusCode);
    next(error);
  }
};

export const getGd = async (req, res, next) => {
  try {
    const { id } = req.params;

    const gd = await GroupDiscussion.findOne({ _id: id, user: req.user._id });

    if (!gd) {
      res.status(404);
      throw new Error('Discussion not found');
    }

    res.status(200).json({ success: true, data: gd });
  } catch (error) {
    next(error);
  }
};
