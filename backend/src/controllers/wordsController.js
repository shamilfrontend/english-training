import Word from '../models/Word.js';
import UserWord from '../models/UserWord.js';

export const getWords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const difficulty = req.query.difficulty;
    const search = req.query.search;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { word: { $regex: search, $options: 'i' } },
        { translation: { $regex: search, $options: 'i' } }
      ];
    }

    const words = await Word.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ word: 1 });

    const total = await Word.countDocuments(query);

    res.json({
      words,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Ошибка получения слов:', error);
    res.status(500).json({ error: 'Ошибка получения слов' });
  }
};

export const getRandomWords = async (req, res) => {
  try {
    const count = parseInt(req.query.count) || 10;
    const userId = req.user?._id;
    const difficulty = req.query.difficulty;

    const query = {};
    if (difficulty) query.difficulty = difficulty;

    // Если пользователь авторизован, получаем слова для повторения или новые
    if (userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Находим слова для повторения
      const wordsToReview = await UserWord.find({
        userId,
        nextReview: { $lte: today },
        isLearned: false
      }).limit(count).populate('wordId');

      if (wordsToReview.length >= count) {
        return res.json({
          words: wordsToReview.map(uw => uw.wordId),
          type: 'review'
        });
      }

      // Если недостаточно слов для повторения, добавляем новые
      const reviewedWordIds = wordsToReview.map(uw => uw.wordId._id);
      const newWordsNeeded = count - wordsToReview.length;

      const newWords = await Word.find({
        ...query,
        _id: { $nin: reviewedWordIds }
      }).limit(newWordsNeeded);

      const allWords = [
        ...wordsToReview.map(uw => uw.wordId),
        ...newWords
      ];

      return res.json({
        words: allWords.slice(0, count),
        type: 'mixed'
      });
    }

    // Для неавторизованных пользователей просто случайные слова
    const words = await Word.aggregate([
      { $match: query },
      { $sample: { size: count } }
    ]);

    res.json({
      words,
      type: 'random'
    });
  } catch (error) {
    console.error('Ошибка получения случайных слов:', error);
    res.status(500).json({ error: 'Ошибка получения слов' });
  }
};

export const getWordById = async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ error: 'Слово не найдено' });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения слова' });
  }
};

