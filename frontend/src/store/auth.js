import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/utils/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка входа',
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        name,
      });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка регистрации',
      };
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      user.value = response.data;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка загрузки профиля',
      };
    }
  };

  // Загружаем профиль при инициализации если есть токен
  if (token.value) {
    fetchProfile();
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    fetchProfile,
  };
});
