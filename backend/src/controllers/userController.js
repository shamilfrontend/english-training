import UserWord from '../models/UserWord.js';
import Session from '../models/Session.js';
import Word from '../models/Word.js';
import User from '../models/User.js';
import { calculateNextReview } from '../utils/spacedRepetition.js';

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const learnedCount = await UserWord.countDocuments({
      userId,
      isLearned: true
    });

    const totalWords = await Word.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const wordsToReview = await UserWord.countDocuments({
      userId,
      nextReview: { $lte: today },
      isLearned: false
    });

    // Статистика за последние 7 дней
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSessions = await Session.find({
      userId,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: -1 });

    const totalCorrect = recentSessions.reduce((sum, s) => sum + s.correctAnswers, 0);
    const totalQuestions = recentSessions.reduce((sum, s) => sum + s.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    res.json({
      learnedWords: learnedCount,
      totalWords,
      wordsToReview,
      accuracy,
      dailyStreak: user.dailyStreak,
      recentSessions: recentSessions.slice(0, 7),
      progress: Math.round((learnedCount / totalWords) * 100)
    });
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
};

export const markWordLearned = async (req, res) => {
  try {
    const userId = req.user._id;
    const wordId = req.params.wordId;

    let userWord = await UserWord.findOne({ userId, wordId });

    if (!userWord) {
      userWord = await UserWord.create({
        userId,
        wordId,
        level: 1,
        isLearned: true
      });
    } else {
      userWord.isLearned = true;
      userWord.level = Math.max(userWord.level, 4);
      await userWord.save();
    }

    res.json({ success: true, userWord });
  } catch (error) {
    console.error('Ошибка отметки слова:', error);
    res.status(500).json({ error: 'Ошибка отметки слова' });
  }
};

export const completeTraining = async (req, res) => {
  try {
    const userId = req.user._id;
    const { words, answers, trainingType } = req.body;

    if (!words || !answers || !Array.isArray(words) || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Неверный формат данных' });
    }

    let correctCount = 0;
    const wordUpdates = [];

    // Обрабатываем каждое слово
    for (let i = 0; i < words.length; i++) {
      const wordId = words[i];
      const isCorrect = answers[i] === true;

      if (isCorrect) correctCount++;

      let userWord = await UserWord.findOne({ userId, wordId });

      if (!userWord) {
        userWord = await UserWord.create({
          userId,
          wordId,
          level: 0,
          correctAnswers: isCorrect ? 1 : 0,
          totalAnswers: 1
        });
      } else {
        userWord.correctAnswers += isCorrect ? 1 : 0;
        userWord.totalAnswers += 1;
      }

      // Применяем spaced repetition
      const { level, nextReview, isLearned } = calculateNextReview(
        userWord.level,
        isCorrect
      );

      userWord.level = level;
      userWord.nextReview = nextReview;
      userWord.isLearned = isLearned || userWord.isLearned;
      userWord.lastReviewed = new Date();
      await userWord.save();

      wordUpdates.push({
        wordId,
        level: userWord.level,
        isLearned: userWord.isLearned
      });
    }

    // Создаем сессию
    const score = Math.round((correctCount / words.length) * 100);
    const xpEarned = correctCount * 10; // 10 XP за правильный ответ

    const session = await Session.create({
      userId,
      wordsStudied: words,
      score,
      totalQuestions: words.length,
      correctAnswers: correctCount,
      trainingType: trainingType || 'translation',
      xpEarned
    });

    // Обновляем XP пользователя
    const user = await User.findById(userId);
    user.totalXP += xpEarned;
    await user.save();

    res.json({
      success: true,
      session: {
        id: session._id,
        score,
        correctAnswers: correctCount,
        totalQuestions: words.length,
        xpEarned
      },
      wordUpdates
    });
  } catch (error) {
    console.error('Ошибка завершения тренировки:', error);
    res.status(500).json({ error: 'Ошибка завершения тренировки' });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { wordsPerDay, notifications, language } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    if (wordsPerDay !== undefined) {
      user.settings.wordsPerDay = wordsPerDay;
    }
    if (notifications !== undefined) {
      user.settings.notifications = notifications;
    }
    if (language !== undefined) {
      user.settings.language = language;
    }

    await user.save();

    res.json({
      success: true,
      settings: user.settings
    });
  } catch (error) {
    console.error('Ошибка обновления настроек:', error);
    res.status(500).json({ error: 'Ошибка обновления настроек' });
  }
};

