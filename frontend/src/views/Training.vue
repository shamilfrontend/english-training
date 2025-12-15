<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__content">
      <div class="container">
        <div v-if="!started" class="training__start">
          <h1 class="page-title">Тренировка</h1>
          <p v-if="categoryName" class="training__category">
            Категория: {{ categoryName }}
          </p>
          <p class="training__info">
            Вам будет показано {{ words.length }} слов. Изучайте их внимательно!
          </p>
          <button @click="startTraining" class="btn btn--primary btn--large">
            Начать тренировку
          </button>
        </div>

        <div v-else-if="currentIndex < words.length" class="training__content">
          <div class="training__progress">
            <div class="training__progress-bar">
              <div
                class="training__progress-bar-fill"
                :style="{ width: (currentIndex / words.length) * 100 + '%' }"
              ></div>
            </div>
            <p class="training__progress-text">
              {{ currentIndex + 1 }} / {{ words.length }}
            </p>
          </div>

          <WordCard
            v-if="currentWord.word"
            :key="currentWord.word._id"
            :word="currentWord.word"
            :options="currentWord.options"
            :correct-index="currentWord.correctIndex"
            @answer="handleAnswer"
          />
        </div>

        <div v-else class="training__complete">
          <h1 class="page-title">Тренировка завершена!</h1>
          <div class="training__results">
            <div class="progress__stat">
              <div class="progress__stat-value">{{ results.correct }}</div>
              <div class="progress__stat-label">Правильно</div>
            </div>
            <div class="progress__stat">
              <div class="progress__stat-value">{{ results.wrong }}</div>
              <div class="progress__stat-label">Неправильно</div>
            </div>
          </div>
          <div class="training__actions">
            <button @click="restartTraining" class="btn btn--primary btn--large">
              Начать заново
            </button>
            <router-link to="/dashboard" class="btn btn--outline btn--large">
              На главную
            </router-link>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import AppHeader from '@/components/layout/AppHeader.vue';
import WordCard from '@/components/training/WordCard.vue';
import { useWordsStore } from '@/store/words';
import { useProgressStore } from '@/store/progress';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const wordsStore = useWordsStore();
const progressStore = useProgressStore();

const category = route.params.category;
const words = ref([]);
const currentIndex = ref(0);
const started = ref(false);
const results = ref({ correct: 0, wrong: 0 });
const trainingResults = ref([]);

const categoryName = computed(() => {
  const cat = wordsStore.categories.find((c) => c.id === category);
  return cat ? cat.name : '';
});

const currentWord = computed(() => {
  return words.value[currentIndex.value] || {};
});

const loadWords = async () => {
  // Если выбрана категория, загружаем все слова без лимита
  const limit = category ? 1000 : 10;
  const result = await wordsStore.getDailyTraining(category || undefined, limit);
  
  if (result.success) {
    words.value = result.data;
    if (words.value.length === 0) {
      toast.info('Нет слов для тренировки');
      router.push('/categories');
    }
  } else {
    toast.error(result.error);
    router.push('/categories');
  }
};

const startTraining = () => {
  started.value = true;
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

  if (answerData.isCorrect) {
    results.value.correct++;
  } else {
    results.value.wrong++;
  }

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
    toast.success('Результаты сохранены!');
  } else {
    toast.error(result.error);
  }
};

const restartTraining = () => {
  started.value = false;
  currentIndex.value = 0;
  results.value = { correct: 0, wrong: 0 };
  trainingResults.value = [];
  loadWords();
};

onMounted(() => {
  loadWords();
});
</script>

<style lang="scss" scoped>
@import '../styles/components.scss';

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: white;
  text-align: center;
}

.training {
  &__start {
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
  }

  &__category {
    font-size: 1.25rem;
    color: white;
    opacity: 0.9;
    margin-bottom: 1rem;
  }

  &__info {
    color: white;
    opacity: 0.8;
    margin-bottom: 2rem;
  }

  &__content {
    max-width: 600px;
    margin: 0 auto;
  }

  &__progress {
    margin-bottom: 2rem;
  }

  &__progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-sm);
    overflow: hidden;
    margin-bottom: 0.5rem;

    &-fill {
      height: 100%;
      background: var(--success-color);
      transition: width 0.3s;
    }
  }

  &__progress-text {
    text-align: center;
    color: white;
    font-weight: 500;
  }

  &__complete {
    text-align: center;
    max-width: 500px;
    margin: 0 auto;
  }

  &__results {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 2rem 0;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: center;
    }
  }
}
</style>

