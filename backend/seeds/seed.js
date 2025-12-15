import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Word from '../src/models/Word.js';
import { wordsData } from './wordsData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Очищаем коллекцию слов
    await Word.deleteMany({});
    console.log('Cleared existing words');

    // Добавляем слова из всех категорий
    const wordsToInsert = [];
    
    for (const [category, words] of Object.entries(wordsData)) {
      for (const wordData of words) {
        wordsToInsert.push({
          ...wordData,
          category,
          difficulty: 'medium', // Можно добавить логику определения сложности
        });
      }
    }

    await Word.insertMany(wordsToInsert);
    console.log(`Inserted ${wordsToInsert.length} words`);

    // Выводим статистику по категориям
    const stats = await Word.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    console.log('\nWords by category:');
    stats.forEach((stat) => {
      console.log(`  ${stat._id}: ${stat.count} words`);
    });

    await mongoose.connection.close();
    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

void seedDatabase();
