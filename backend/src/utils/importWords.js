import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import Word from '../models/Word.js';

dotenv.config();

const WORDS_URL = 'https://raw.githubusercontent.com/shamilfrontend/english-russian-dictionary/main/words.json';

async function importWords() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/english-training');
    console.log('✅ Подключено к MongoDB');

    // Загружаем слова из GitHub
    console.log('📥 Загрузка слов из GitHub...');
    const response = await axios.get(WORDS_URL);
    const words = response.data;

    console.log(`📚 Найдено ${words.length} слов`);

    let imported = 0;
    let skipped = 0;
    let errors = 0;

    for (const wordData of words) {
      try {
        // Проверяем, существует ли слово
        const exists = await Word.findOne({ word: wordData.word.toLowerCase() });
        
        if (exists) {
          skipped++;
          continue;
        }

        // Определяем сложность на основе длины слова и транскрипции
        let difficulty = 'beginner';
        const wordLength = wordData.word.length;
        if (wordLength > 8) {
          difficulty = 'advanced';
        } else if (wordLength > 5) {
          difficulty = 'intermediate';
        }

        await Word.create({
          word: wordData.word.toLowerCase(),
          translation: wordData.translation,
          transcription: wordData.transcription || '',
          example: wordData.example || '',
          category: wordData.category || 'general',
          difficulty
        });

        imported++;
        
        if (imported % 100 === 0) {
          console.log(`✅ Импортировано ${imported} слов...`);
        }
      } catch (error) {
        errors++;
        console.error(`❌ Ошибка при импорте слова "${wordData.word}":`, error.message);
      }
    }

    console.log('\n📊 Результаты импорта:');
    console.log(`✅ Импортировано: ${imported}`);
    console.log(`⏭️  Пропущено (дубликаты): ${skipped}`);
    console.log(`❌ Ошибок: ${errors}`);
    console.log(`📚 Всего в базе: ${await Word.countDocuments()}`);

    await mongoose.disconnect();
    console.log('✅ Импорт завершен');
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    process.exit(1);
  }
}

importWords();

