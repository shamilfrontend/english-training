import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../services/api';

export const useWordsStore = defineStore('words', () => {
  const words = ref([]);
  const loading = ref(false);
  const progress = ref(null);

  const fetchRandomWords = async (count = 10) => {
    loading.value = true;
    try {
      const response = await api.get(`/words/random?count=${count}`);
      words.value = response.data.words;
      return response.data.words;
    } catch (error) {
      console.error('Ошибка загрузки слов:', error);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await api.get('/user/progress');
      progress.value = response.data;
      return response.data;
    } catch (error) {
      console.error('Ошибка загрузки прогресса:', error);
      return null;
    }
  };

  const completeTraining = async (wordsData, answers, trainingType) => {
    try {
      const wordIds = wordsData.map(w => w._id || w.id);
      const response = await api.post('/user/training', {
        words: wordIds,
        answers,
        trainingType
      });
      
      // Обновляем прогресс после тренировки
      await fetchProgress();
      
      return response.data;
    } catch (error) {
      console.error('Ошибка завершения тренировки:', error);
      throw error;
    }
  };

  return {
    words,
    loading,
    progress,
    fetchRandomWords,
    fetchProgress,
    completeTraining
  };
});

