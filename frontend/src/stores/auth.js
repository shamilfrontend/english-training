import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const init = async () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        user.value = JSON.parse(savedUser);
      } catch (e) {
        // Игнорируем ошибку парсинга
      }
    }
    
    if (token.value) {
      try {
        const response = await api.get('/auth/me');
        user.value = response.data;
        localStorage.setItem('user', JSON.stringify(user.value));
      } catch (error) {
        logout();
      }
    }
  };

  const login = async (email, password) => {
    loading.value = true;
    try {
      const response = await api.post('/auth/login', { email, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка входа'
      };
    } finally {
      loading.value = false;
    }
  };

  const register = async (email, password, name) => {
    loading.value = true;
    try {
      const response = await api.post('/auth/register', { email, password, name });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Ошибка регистрации'
      };
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    user,
    token,
    loading,
    isAuthenticated,
    init,
    login,
    register,
    logout
  };
});

