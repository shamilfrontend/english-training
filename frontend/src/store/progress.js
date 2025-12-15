import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '@/utils/api';

export const useProgressStore = defineStore('progress', () => {
  const progress = ref([]);
  const categoryProgress = ref({});
  const loading = ref(false);

  const fetchProgress = async (category) => {
    loading.value = true;
    try {
      const params = category ? { category } : {};
      const response = await api.get('/progress', { params });
      progress.value = response.data;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки прогресса',
      };
    } finally {
      loading.value = false;
    }
  };

  const getCategoryProgress = async (category) => {
    try {
      const response = await api.get(`/progress/categories/${category}`);
      categoryProgress.value[category] = response.data;
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки прогресса категории',
      };
    }
  };

  const updateProgress = async (wordId, quality) => {
    try {
      const response = await api.put(`/progress/${wordId}`, { quality });
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка обновления прогресса',
      };
    }
  };

  const getStats = () => {
    const stats = {
      total: progress.value.length,
      new: 0,
      learning: 0,
      review: 0,
      mastered: 0,
    };

    progress.value.forEach((p) => {
      if (p.status) {
        stats[p.status] = (stats[p.status] || 0) + 1;
      }
    });

    return stats;
  };

  return {
    progress,
    categoryProgress,
    loading,
    fetchProgress,
    getCategoryProgress,
    updateProgress,
    getStats,
  };
});
