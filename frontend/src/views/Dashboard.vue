<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <h1 class="page-title">Добро пожаловать!</h1>
        
        <div class="dashboard__stats">
          <div class="progress__stat">
            <div class="progress__stat-value">{{ stats.mastered }}</div>
            <div class="progress__stat-label">Изучено</div>
          </div>
          <div class="progress__stat">
            <div class="progress__stat-value">{{ stats.learning }}</div>
            <div class="progress__stat-label">Изучаю</div>
          </div>
          <div class="progress__stat">
            <div class="progress__stat-value">{{ stats.review }}</div>
            <div class="progress__stat-label">На повторении</div>
          </div>
        </div>

        <div class="dashboard__actions">
          <router-link to="/training" class="card dashboard__action-card">
            <h2>Быстрый старт</h2>
            <p>Начните тренировку прямо сейчас</p>
            <button class="btn btn--primary btn--full">Начать</button>
          </router-link>
          
          <router-link to="/categories" class="card dashboard__action-card">
            <h2>Категории</h2>
            <p>Выберите категорию для изучения</p>
            <button class="btn btn--outline btn--full">Выбрать</button>
          </router-link>
          
          <router-link to="/review" class="card dashboard__action-card">
            <h2>Повторение</h2>
            <p v-if="reviewCount > 0">
              {{ reviewCount }} слов готовы к повторению
            </p>
            <p v-else>Нет слов для повторения</p>
            <button class="btn btn--outline btn--full" :disabled="reviewCount === 0">
              Повторить
            </button>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useProgressStore } from '@/store/progress';
import { useWordsStore } from '@/store/words';

const toast = useToast();
const progressStore = useProgressStore();
const wordsStore = useWordsStore();

const stats = ref({
  mastered: 0,
  learning: 0,
  review: 0,
});

const reviewCount = ref(0);

const loadData = async () => {
  const progressResult = await progressStore.fetchProgress();
  if (progressResult.success) {
    stats.value = progressStore.getStats();
  }

  const reviewResult = await wordsStore.getReviewWords();
  if (reviewResult.success) {
    reviewCount.value = reviewResult.data.length;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
@import '../styles/components.scss';

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
}

.dashboard {
  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  &__actions {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__action-card {
    text-decoration: none;
    color: var(--text-primary);
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }
  }
}
</style>

