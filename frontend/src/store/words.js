import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export const useWordsStore = defineStore('words', () => {
  const categories = ref([]);
  const words = ref([]);
  const loading = ref(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/words/categories');
      categories.value = response.data;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки категорий',
      };
    }
  };

  const getWordsCount = async () => {
    try {
      const response = await api.get('/words/count');
      return { success: true, count: response.data.count };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки количества слов',
      };
    }
  };

  const fetchWords = async (category, limit = 50) => {
    loading.value = true;
    try {
      const params = { limit };
      if (category) params.category = category;
      const response = await api.get('/words', { params });
      words.value = response.data;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки слов',
      };
    } finally {
      loading.value = false;
    }
  };

  const getDailyTraining = async (category, limit = 10) => {
    loading.value = true;
    try {
      const params = { limit };
      if (category) params.category = category;
      const response = await api.get('/training/daily', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки тренировки',
      };
    } finally {
      loading.value = false;
    }
  };

  const getReviewWords = async (all = false) => {
    loading.value = true;
    try {
      const params = all ? { all: 'true' } : {};
      const response = await api.get('/training/review', { params });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки повторений',
      };
    } finally {
      loading.value = false;
    }
  };

  const completeTraining = async (results) => {
    try {
      const response = await api.post('/training/complete', { results });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка сохранения результатов',
      };
    }
  };

  return {
    categories,
    words,
    loading,
    fetchCategories,
    fetchWords,
    getDailyTraining,
    getReviewWords,
    completeTraining,
    getWordsCount,
  };
});

