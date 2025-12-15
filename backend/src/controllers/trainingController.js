import Word from '../models/Word.js';
import UserProgress from '../models/UserProgress.js';
import { calculateNextReview, getStatusFromQuality } from '../utils/srs.js';

// Функция для генерации вариантов ответов
const generateOptions = (correctWord, allWords, count = 4) => {
  const correctId = correctWord._id?.toString() || correctWord._id;
  
  // Получаем случайные неправильные варианты из других слов
  const wrongOptions = allWords
    .filter((w) => {
      const wordId = w._id?.toString() || w._id;
      return wordId !== correctId;
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, count - 1)
    .map((w) => w.translation);

  // Если недостаточно вариантов, добавляем пустые строки
  while (wrongOptions.length < count - 1) {
    wrongOptions.push('...');
  }

  // Добавляем правильный ответ
  const options = [correctWord.translation, ...wrongOptions];

  // Перемешиваем варианты
  const shuffled = options.sort(() => Math.random() - 0.5);

  return {
    options: shuffled,
    correctIndex: shuffled.indexOf(correctWord.translation),
  };
};

export const getDailyTraining = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { category, limit } = req.query;

    const query = category ? { category } : {};
    
    // Получаем все слова для генерации вариантов
    const allWords = await Word.find(query);
    
    // Если указана категория и нет лимита, берем все слова категории
    // Если лимит указан, применяем его
    const words = limit 
      ? allWords.sort(() => Math.random() - 0.5).slice(0, parseInt(limit))
      : allWords.sort(() => Math.random() - 0.5);

    // Получаем прогресс для этих слов
    const wordIds = words.map((w) => w._id);
    const progress = await UserProgress.find({
      userId,
      wordId: { $in: wordIds },
    });

    const progressMap = new Map(
      progress.map((p) => [p.wordId.toString(), p])
    );

    // Формируем список слов для тренировки с вариантами ответов
    const trainingWords = words.map((word) => {
      const wordProgress = progressMap.get(word._id.toString());
      const { options, correctIndex } = generateOptions(
        word,
        allWords,
        4
      );

      return {
        word: word.toObject(),
        progress: wordProgress || null,
        options,
        correctIndex,
      };
    });

    res.json(trainingWords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewWords = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { all } = req.query; // Параметр для получения всех review слов
    const now = new Date();

    let query;

    // Если all=true, получаем все слова со статусом review независимо от даты
    if (all === 'true') {
      query = {
        userId,
        status: 'review',
      };
    } else {
      // Обычный режим - только слова, которые нужно повторить по расписанию
      query = {
        userId,
        status: { $in: ['learning', 'review'] },
        $or: [
          { nextReview: { $lte: now } },
          { nextReview: null },
          { status: 'learning' },
        ],
      };
    }

    const progress = await UserProgress.find(query)
      .populate('wordId')
      .limit(all === 'true' ? 100 : 20); // Больше слов если все review

    const wordsWithProgress = progress.filter((p) => p.wordId);
    
    if (wordsWithProgress.length === 0) {
      return res.json([]);
    }

    // Получаем все слова для генерации вариантов
    const wordIds = wordsWithProgress.map((p) => p.wordId._id);
    const allWords = await Word.find({
      _id: { $nin: wordIds },
    }).limit(100); // Ограничиваем для производительности

    // Преобразуем все слова в объекты для генерации вариантов
    const allWordsArray = [
      ...allWords.map((w) => w.toObject()),
      ...wordsWithProgress.map((wp) => wp.wordId.toObject()),
    ];

    // Формируем список слов с вариантами ответов
    const words = wordsWithProgress.map((p) => {
      const word = p.wordId.toObject();
      const { options, correctIndex } = generateOptions(
        word,
        allWordsArray,
        4
      );

      return {
        word,
        progress: {
          status: p.status,
          correctAnswers: p.correctAnswers,
          wrongAnswers: p.wrongAnswers,
        },
        options,
        correctIndex,
      };
    });

    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeTraining = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { results } = req.body; // [{ wordId, isCorrect, selectedIndex, correctIndex }]

    const updates = [];

    for (const result of results) {
      const { wordId, isCorrect } = result;

      // Определяем quality на основе правильности ответа
      // Правильный ответ = 5 (легко), неправильный = 0 (забыл)
      const quality = isCorrect ? 5 : 0;

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
      if (isCorrect) {
        progress.correctAnswers += 1;
      } else {
        progress.wrongAnswers += 1;
      }

      progress.lastPracticed = new Date();

      // Вычисляем следующий обзор
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
      updates.push(progress);
    }

    res.json({ success: true, updated: updates.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

