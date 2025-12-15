<script setup>
import { ref, computed, onMounted } from 'vue';

import AppHeader from '@/components/layout/AppHeader.vue';
import { useProgressStore } from '@/store/progress';
import { useWordsStore } from '@/store/words';

const progressStore = useProgressStore();
const wordsStore = useWordsStore();

const loading = ref(true);
const stats = ref({
  mastered: 0,
  learning: 0,
  review: 0,
  new: 0,
});

const totalWords = ref(0);

const loadData = async () => {
  loading.value = true;

  const progressResult = await progressStore.fetchProgress();
  if (progressResult.success) {
    stats.value = progressStore.getStats();
  }

  const wordsResult = await wordsStore.fetchWords();
  if (wordsResult.success) {
    totalWords.value = wordsStore.words.length;
  }

  loading.value = false;
};

const learnedWords = computed(() => stats.value.mastered + stats.value.learning + stats.value.review);

const progressPercent = computed(() => {
  if (totalWords.value === 0) return 0;
  return Math.round((learnedWords.value / totalWords.value) * 100);
});

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <h1 class="page-title">Статистика</h1>

        <div v-if="loading" class="loading">Загрузка...</div>

        <div v-else class="statistics">
          <div class="progress__stats">
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
            <div class="progress__stat">
              <div class="progress__stat-value">{{ stats.new }}</div>
              <div class="progress__stat-label">Новых</div>
            </div>
          </div>

          <div class="card">
            <h2>Общий прогресс</h2>
            <div class="progress-bar-large">
              <div
                class="progress-bar-large__fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <p class="progress-text">
              Изучено {{ learnedWords }} из {{ totalWords }} слов
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@import '../styles/components.scss';

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.25rem;
}

.statistics {
  h2 {
    margin-bottom: 1rem;
  }
}

.progress-bar-large {
  width: 100%;
  height: 24px;
  background: var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  margin: 1rem 0;

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    transition: width 0.5s;
  }
}

.progress-text {
  text-align: center;
  color: var(--text-secondary);
  font-weight: 500;
}
</style>
