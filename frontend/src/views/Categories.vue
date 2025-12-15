<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <h1 class="page-title">Категории</h1>
        <p v-if="totalWordsCount !== null" class="categories__total">
          Общее количество слов - {{ totalWordsCount }}
        </p>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else class="categories-grid">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/training/${category.id}`"
            class="category-card"
          >
            <div class="category-card__name">{{ category.name }}</div>
            <div class="category-card__progress">
              {{ getCategoryProgressText(category.id) }}
            </div>
            <div class="category-card__progress-bar">
              <div
                class="category-card__progress-bar-fill"
                :style="{ width: getCategoryProgressPercent(category.id) + '%' }"
              ></div>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import AppHeader from '@/components/layout/AppHeader.vue';
import { useWordsStore } from '@/store/words';
import { useProgressStore } from '@/store/progress';

const toast = useToast();
const wordsStore = useWordsStore();
const progressStore = useProgressStore();

const categories = ref([]);
const loading = ref(true);
const totalWordsCount = ref(null);

const loadCategories = async () => {
  loading.value = true;
  const result = await wordsStore.fetchCategories();
  
  if (result.success) {
    categories.value = wordsStore.categories;
    
    // Загружаем прогресс для всех категорий
    for (const category of categories.value) {
      await progressStore.getCategoryProgress(category.id);
    }
  } else {
    toast.error(result.error);
  }
  
  // Загружаем общее количество слов
  const countResult = await wordsStore.getWordsCount();
  if (countResult.success) {
    totalWordsCount.value = countResult.count;
  }
  
  loading.value = false;
};

const getCategoryProgress = (categoryId) => {
  return progressStore.categoryProgress[categoryId] || {
    total: 0,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
  };
};

const getCategoryProgressText = (categoryId) => {
  const progress = getCategoryProgress(categoryId);
  if (progress.total === 0) return 'Не начато';
  const learned = progress.mastered + progress.review + progress.learning;
  return `${learned} / ${progress.total}`;
};

const getCategoryProgressPercent = (categoryId) => {
  const progress = getCategoryProgress(categoryId);
  if (progress.total === 0) return 0;
  const learned = progress.mastered + progress.review + progress.learning;
  return Math.round((learned / progress.total) * 100);
};

onMounted(() => {
  loadCategories();
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

.loading {
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.25rem;
}

.categories {
  &__total {
    font-size: 1.125rem;
    color: white;
    opacity: 0.9;
    margin-bottom: 2rem;
    text-align: center;
  }
}
</style>

