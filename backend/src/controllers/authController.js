import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Проверяем, существует ли пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const passwordHash = await bcrypt.hash(password, 10);

    // Создаем пользователя
    const user = await User.create({
      email,
      passwordHash,
      name
    });

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        dailyStreak: user.dailyStreak,
        settings: user.settings
      }
    });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email и пароль обязательны' });
    }

    // Находим пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Проверяем пароль
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    // Обновляем streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastActive = new Date(user.lastActiveDate);
    lastActive.setHours(0, 0, 0, 0);
    
    if (lastActive.getTime() === today.getTime()) {
      // Уже активен сегодня
    } else if (lastActive.getTime() === today.getTime() - 86400000) {
      // Продолжаем серию
      user.dailyStreak += 1;
    } else {
      // Сбрасываем серию
      user.dailyStreak = 1;
    }
    
    user.lastActiveDate = new Date();
    await user.save();

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        dailyStreak: user.dailyStreak,
        settings: user.settings,
        totalXP: user.totalXP
      }
    });
  } catch (error) {
    console.error('Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка сервера при входе' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      dailyStreak: user.dailyStreak,
      settings: user.settings,
      totalXP: user.totalXP,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка получения данных пользователя' });
  }
};

