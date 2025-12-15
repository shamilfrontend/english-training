import UserProgress from '../models/UserProgress.js';
import Word from '../models/Word.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.query;

    const query = { userId };
    if (category) {
      const words = await Word.find({ category }).select('_id');
      const wordIds = words.map((w) => w._id);
      query.wordId = { $in: wordIds };
    }

    const progress = await UserProgress.find(query).populate('wordId');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { wordId } = req.params;
    const { quality } = req.body; // 0-5

    let progress = await UserProgress.findOne({ userId, wordId });

    if (!progress) {
      progress = new UserProgress({
        userId,
        wordId,
        status: 'new',
        interval: 0,
        easeFactor: 2.5,
      });
    }

    // Обновляем статистику
    if (quality >= 3) {
      progress.correctAnswers += 1;
    } else {
      progress.wrongAnswers += 1;
    }

    progress.lastPracticed = new Date();

    // Вычисляем следующий обзор используя SRS
    const { calculateNextReview, getStatusFromQuality } = await import(
      '../utils/srs.js'
    );
    const srsResult = calculateNextReview(
      quality,
      progress.interval,
      progress.easeFactor
    );

    progress.interval = srsResult.interval;
    progress.easeFactor = srsResult.easeFactor;
    progress.nextReview = srsResult.nextReview;
    progress.status = getStatusFromQuality(quality, progress.status);

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category } = req.params;

    const words = await Word.find({ category }).select('_id');
    const wordIds = words.map((w) => w._id);

    const progress = await UserProgress.find({
      userId,
      wordId: { $in: wordIds },
    });

    const stats = {
      total: words.length,
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };

    progress.forEach((p) => {
      stats[p.status] = (stats[p.status] || 0) + 1;
    });

    stats.new = stats.total - progress.length;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

