import Word from '../models/Word.js';

export const getWords = async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const query = category ? { category } : {};

    const words = await Word.find(query).limit(parseInt(limit));
    res.json(words);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRandomWord = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const count = await Word.countDocuments(query);
    const random = Math.floor(Math.random() * count);
    const word = await Word.findOne(query).skip(random);

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    res.json(word);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = [
      { id: 'general', name: 'Общие слова' },
      { id: 'pronouns', name: 'Местоимения' },
      { id: 'body', name: 'Тело' },
      { id: 'appearance', name: 'Внешность' },
      { id: 'character', name: 'Характер и эмоции' },
      { id: 'family', name: 'Семья и окружение' },
      { id: 'clothing', name: 'Одежда и обувь' },
      { id: 'life', name: 'Жизнь' },
      { id: 'food', name: 'Еда и напитки' },
      { id: 'professions', name: 'Профессии и работа' },
      { id: 'home', name: 'Дом' },
      { id: 'sports', name: 'Спорт и хобби' },
      { id: 'travel', name: 'Путешествия и отдых' },
      { id: 'qualities', name: 'Качества предметов' },
      { id: 'colors', name: 'Цвета' },
      { id: 'properties', name: 'Свойства' },
      { id: 'time', name: 'Время' },
      { id: 'cardinal', name: 'Количественные числительные' },
      { id: 'ordinal', name: 'Порядковые числительные' },
      { id: 'weather', name: 'Погода' },
      { id: 'landscape', name: 'Пейзаж' },
      { id: 'animals', name: 'Животные' },
      { id: 'plants', name: 'Растения' },
      { id: 'holidays', name: 'Праздники' },
      { id: 'places', name: 'Места' },
      { id: 'conjunctions', name: 'Союзы' },
      { id: 'prepositions', name: 'Предлоги' },
    ];

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWordsCount = async (req, res) => {
  try {
    const count = await Word.countDocuments({});
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

