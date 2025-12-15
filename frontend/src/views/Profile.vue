<template>
  <div class="profile-page">
    <AppHeader />

    <div class="container">
      <div class="profile-content">
        <h1 class="page-title">Профиль</h1>

        <div class="profile-grid">
          <div class="profile-card card">
            <h2 class="card-title">Статистика</h2>
            <div v-if="progress" class="stats-list">
              <div class="stat-item">
                <span class="stat-label">Изучено слов:</span>
                <span class="stat-value">{{ progress.learnedWords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Всего слов:</span>
                <span class="stat-value">{{ progress.totalWords }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Прогресс:</span>
                <span class="stat-value">{{ progress.progress }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Точность:</span>
                <span class="stat-value">{{ progress.accuracy }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Дней подряд:</span>
                <span class="stat-value">{{ progress?.dailyStreak || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Опыт (XP):</span>
                <span class="stat-value">{{ user?.totalXP || 0 }}</span>
              </div>
            </div>
          </div>

          <div class="settings-card card">
            <h2 class="card-title">Настройки</h2>
            <div class="settings-list">
              <div class="setting-item">
                <label class="setting-label">
                  Слов в день
                </label>
                <input
                  v-model.number="settings.wordsPerDay"
                  type="number"
                  min="5"
                  max="50"
                  class="input"
                />
              </div>

              <div class="setting-item">
                <label class="setting-label">
                  <input
                    v-model="settings.notifications"
                    type="checkbox"
                    class="checkbox"
                  />
                  Уведомления о тренировках
                </label>
              </div>

              <div class="setting-item">
                <label class="setting-label">Язык интерфейса</label>
                <select v-model="settings.language" class="input">
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>

              <button
                @click="saveSettings"
                class="btn btn-primary btn-full"
                :disabled="saving"
              >
                {{ saving ? 'Сохранение...' : 'Сохранить настройки' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="progress?.recentSessions?.length" class="activity-card card">
          <h2 class="card-title">Активность за последние дни</h2>
          <div class="activity-list">
            <div
              v-for="session in progress.recentSessions"
              :key="session._id"
              class="activity-item"
            >
              <div class="activity-date">
                {{ formatDate(session.date) }}
              </div>
              <div class="activity-info">
                <span class="activity-type">{{ getTrainingTypeName(session.trainingType) }}</span>
                <span class="activity-score">{{ session.score }}%</span>
              </div>
              <div class="activity-details">
                {{ session.correctAnswers }}/{{ session.totalQuestions }} правильных
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useWordsStore } from '../stores/words';
import api from '../services/api';
import AppHeader from '../components/AppHeader.vue';

const authStore = useAuthStore();
const wordsStore = useWordsStore();

const user = computed(() => authStore.user);
const progress = computed(() => wordsStore.progress);
const saving = ref(false);

const settings = ref({
  wordsPerDay: 20,
  notifications: true,
  language: 'ru'
});

const loadSettings = () => {
  if (user.value?.settings) {
    settings.value = { ...user.value.settings };
  }
};

const saveSettings = async () => {
  saving.value = true;
  try {
    await api.put('/user/settings', settings.value);
    await authStore.init(); // Обновляем данные пользователя
    alert('Настройки сохранены');
  } catch (error) {
    console.error('Ошибка сохранения настроек:', error);
    alert('Ошибка при сохранении настроек');
  } finally {
    saving.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Сегодня';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }
};

const getTrainingTypeName = (type) => {
  const types = {
    translation: 'Выбор перевода',
    writing: 'Написание',
    spaced: 'Повторение',
    listening: 'Аудирование',
    sentence: 'Предложения'
  };
  return types[type] || 'Тренировка';
};

onMounted(async () => {
  await wordsStore.fetchProgress();
  loadSettings();
});
</script>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.profile-content {
  padding-top: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 32px;
  color: white;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.card-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--primary);
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  color: var(--text-light);
}

.stat-value {
  font-weight: 700;
  color: var(--primary);
  font-size: 18px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting-label {
  font-weight: 600;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.activity-card {
  margin-top: 24px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  padding: 16px;
  background: var(--bg);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-date {
  font-weight: 600;
  color: var(--text);
}

.activity-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-type {
  color: var(--text-light);
}

.activity-score {
  font-weight: 700;
  color: var(--primary);
}

.activity-details {
  font-size: 14px;
  color: var(--text-light);
}
</style>

