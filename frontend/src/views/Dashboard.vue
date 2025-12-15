<template>
  <div class="dashboard-page">
    <AppHeader />

    <div class="container">
      <div class="dashboard-content">
        <div class="welcome-section">
          <h1 class="welcome-title">
            Привет, {{ user?.name }}! 👋
          </h1>
          <p class="welcome-subtitle">Готовы продолжить изучение английского?</p>
        </div>

        <div v-if="progress" class="stats-grid">
          <div class="stat-card card">
            <div class="stat-icon">🔥</div>
            <div class="stat-content">
              <div class="stat-value">{{ progress?.dailyStreak || 0 }}</div>
              <div class="stat-label">Дней подряд</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
              <div class="stat-value">{{ progress.learnedWords || 0 }}</div>
              <div class="stat-label">Изучено слов</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
              <div class="stat-value">{{ progress.accuracy || 0 }}%</div>
              <div class="stat-label">Точность</div>
            </div>
          </div>

          <div class="stat-card card">
            <div class="stat-icon">⭐</div>
            <div class="stat-content">
              <div class="stat-value">{{ user?.totalXP || 0 }}</div>
              <div class="stat-label">Опыт (XP)</div>
            </div>
          </div>
        </div>

        <div class="progress-section card">
          <h2 class="section-title">Прогресс изучения</h2>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${progress?.progress || 0}%` }"
              ></div>
            </div>
            <div class="progress-text">
              {{ progress?.learnedWords || 0 }} из {{ progress?.totalWords || 0 }} слов
            </div>
          </div>
        </div>

        <div class="training-section">
          <h2 class="section-title">Тренировки</h2>
          <div class="training-grid">
            <router-link
              to="/training/translation"
              class="training-card card"
            >
              <div class="training-icon">🎯</div>
              <h3>Выбор перевода</h3>
              <p>Выберите правильный перевод слова из 4 вариантов</p>
            </router-link>

            <router-link
              to="/training/writing"
              class="training-card card"
            >
              <div class="training-icon">✍️</div>
              <h3>Написание</h3>
              <p>Напишите слово по переводу</p>
            </router-link>

            <router-link
              to="/training/spaced"
              class="training-card card"
            >
              <div class="training-icon">🔄</div>
              <h3>Повторение</h3>
              <p>Повторите изученные слова</p>
            </router-link>
          </div>
        </div>

        <div v-if="progress?.wordsToReview > 0" class="review-section card">
          <div class="review-content">
            <div>
              <h3>Слова для повторения</h3>
              <p>У вас {{ progress.wordsToReview }} слов готовы к повторению</p>
            </div>
            <router-link to="/training/spaced" class="btn btn-primary">
              Повторить
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useWordsStore } from '../stores/words';
import AppHeader from '../components/AppHeader.vue';

const authStore = useAuthStore();
const wordsStore = useWordsStore();

const user = computed(() => authStore.user);
const progress = computed(() => wordsStore.progress);

onMounted(async () => {
  await wordsStore.fetchProgress();
});
</script>

<style lang="scss" scoped>
.dashboard-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.dashboard-content {
  padding-top: 32px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 32px;
  color: white;
}

.welcome-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (min-width: 768px) {
    font-size: 48px;
  }
}

.welcome-subtitle {
  font-size: 18px;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.stat-icon {
  font-size: 32px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-light);
}

.progress-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.progress-bar-container {
  margin-top: 16px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--success);
  border-radius: 6px;
  transition: width 0.3s;
}

.progress-text {
  text-align: center;
  color: white;
  font-weight: 600;
}

.training-section {
  margin-bottom: 32px;
}

.training-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.training-card {
  text-decoration: none;
  color: var(--text);
  transition: transform 0.2s, box-shadow 0.2s;
  text-align: center;
  padding: 32px 24px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
}

.training-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.training-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--primary);
}

.training-card p {
  color: var(--text-light);
  font-size: 14px;
}

.review-section {
  background: linear-gradient(135deg, var(--warning) 0%, #fbbf24 100%);
  color: white;
}

.review-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  h3 {
    font-size: 20px;
    margin-bottom: 4px;
  }

  p {
    opacity: 0.9;
  }
}
</style>

