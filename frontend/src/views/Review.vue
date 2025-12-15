<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <h1 class="page-title">Повторение</h1>
        
        <div v-if="!loading && words.length === 0 && !showAllReview" class="review__mode-selector">
          <div class="card">
            <h2>Выберите режим повторения</h2>
            <div class="review__modes">
              <button
                @click="loadScheduledReview"
                class="btn btn--primary btn--full"
              >
                Запланированные слова
                <small>Слова, которые нужно повторить сейчас</small>
              </button>
              <button
                @click="loadAllReview"
                class="btn btn--outline btn--full"
              >
                Все изученные слова
                <small>Все слова со статусом "review"</small>
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="loading" class="loading">Загрузка...</div>
        
        <div v-else-if="words.length === 0 && showAllReview" class="empty-state">
          <p>Нет слов для повторения. Продолжайте изучать новые слова!</p>
          <router-link to="/categories" class="btn btn--primary">
            Выбрать категорию
          </router-link>
        </div>

        <div v-else>
          <WordCard
            v-if="currentWord.word"
            :key="currentWord.word._id"
            :word="currentWord.word"
            :options="currentWord.options"
            :correct-index="currentWord.correctIndex"
            @answer="handleAnswer"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import AppHeader from '@/components/layout/AppHeader.vue';
import WordCard from '@/components/training/WordCard.vue';
import { useWordsStore } from '@/store/words';

const router = useRouter();
const toast = useToast();
const wordsStore = useWordsStore();

const words = ref([]);
const currentIndex = ref(0);
const loading = ref(false);
const trainingResults = ref([]);
const showAllReview = ref(false);

const currentWord = computed(() => {
  return words.value[currentIndex.value] || {};
});

const loadScheduledReview = async () => {
  loading.value = true;
  showAllReview.value = true;
  const result = await wordsStore.getReviewWords(false);
  
  if (result.success) {
    words.value = result.data;
    if (words.value.length === 0) {
      toast.info('Нет запланированных слов для повторения');
    }
  } else {
    toast.error(result.error);
  }
  
  loading.value = false;
};

const loadAllReview = async () => {
  loading.value = true;
  showAllReview.value = true;
  const result = await wordsStore.getReviewWords(true);
  
  if (result.success) {
    words.value = result.data;
    if (words.value.length === 0) {
      toast.info('Нет изученных слов для повторения');
    } else {
      toast.success(`Загружено ${words.value.length} слов для повторения`);
    }
  } else {
    toast.error(result.error);
  }
  
  loading.value = false;
};

const handleAnswer = async (answerData) => {
  const word = currentWord.value.word;
  const wordId = word._id;
  
  trainingResults.value.push({
    wordId,
    isCorrect: answerData.isCorrect,
    selectedIndex: answerData.selectedIndex,
    correctIndex: answerData.correctIndex,
  });

  // Небольшая задержка перед переходом к следующему слову
  setTimeout(() => {
    // Переходим к следующему слову
    if (currentIndex.value < words.value.length - 1) {
      currentIndex.value++;
    } else {
      // Сохраняем результаты
      saveResults();
    }
  }, 1500);
};

const saveResults = async () => {
  const result = await wordsStore.completeTraining(trainingResults.value);
  
  if (result.success) {
    toast.success('Повторение завершено!');
    router.push('/dashboard');
  } else {
    toast.error(result.error);
  }
};

// Не загружаем слова автоматически при монтировании
// Пользователь сам выбирает режим повторения
</script>

<style lang="scss" scoped>
@import '../styles/components.scss';

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: white;
  font-size: 1.25rem;

  p {
    margin-bottom: 1rem;
  }
}

.review {
  &__mode-selector {
    max-width: 500px;
    margin: 0 auto;
  }

  &__modes {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;

    button {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      gap: 0.5rem;

      small {
        font-size: 0.875rem;
        opacity: 0.8;
        font-weight: normal;
      }
    }
  }
}
</style>

