<template>
  <div class="training-page">
    <AppHeader />

    <div class="container">
      <div class="training-content">
        <div v-if="!started && !completed" class="training-start card">
          <h1 class="title">Тренировка: {{ trainingTypeName }}</h1>
          <p class="description">{{ trainingDescription }}</p>
          <div class="training-info">
            <div class="info-item">
              <span class="info-label">Слов в тренировке:</span>
              <span class="info-value">{{ wordsPerTraining }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Тип:</span>
              <span class="info-value">{{ trainingTypeName }}</span>
            </div>
          </div>
          <button @click="startTraining" class="btn btn-primary btn-full">
            Начать тренировку
          </button>
        </div>

        <div v-if="started && !completed && currentWord" class="training-question card">
          <div class="question-header">
            <div class="progress-info">
              Вопрос {{ currentIndex + 1 }} из {{ words.length }}
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${((currentIndex + 1) / words.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <div class="question-content">
            <div v-if="trainingType === 'translation'" class="translation-question">
              <div class="word-display">
                <h2 class="word">{{ currentWord.word }}</h2>
                <p v-if="currentWord.transcription" class="transcription">
                  {{ currentWord.transcription }}
                </p>
              </div>
              <p class="question-text">Выберите правильный перевод:</p>
              <div class="options-grid">
                <button
                  v-for="(option, index) in options"
                  :key="index"
                  @click="selectAnswer(option.isCorrect)"
                  class="option-btn"
                  :class="{
                    'selected': selectedAnswer === option.translation,
                    'correct': showResult && option.isCorrect,
                    'incorrect': showResult && selectedAnswer === option.translation && !option.isCorrect
                  }"
                  :disabled="showResult"
                >
                  {{ option.translation }}
                </button>
              </div>
            </div>

            <div v-if="trainingType === 'writing'" class="writing-question">
              <div class="word-display">
                <h2 class="translation">{{ currentWord.translation }}</h2>
                <p v-if="currentWord.transcription" class="transcription">
                  {{ currentWord.transcription }}
                </p>
              </div>
              <p class="question-text">Напишите слово на английском:</p>
              <input
                v-model="userAnswer"
                type="text"
                class="input answer-input"
                placeholder="Введите слово..."
                @keyup.enter="checkWritingAnswer"
                :disabled="showResult"
              />
              <button
                @click="checkWritingAnswer"
                class="btn btn-primary btn-full"
                :disabled="!userAnswer || showResult"
              >
                Проверить
              </button>
            </div>

            <div v-if="trainingType === 'spaced'" class="spaced-question">
              <div class="word-display">
                <h2 class="word">{{ currentWord.word }}</h2>
                <p v-if="currentWord.transcription" class="transcription">
                  {{ currentWord.transcription }}
                </p>
              </div>
              <div class="spaced-options">
                <button
                  @click="selectAnswer(false)"
                  class="btn btn-secondary"
                  :disabled="showResult"
                >
                  Не помню
                </button>
                <button
                  @click="selectAnswer(true)"
                  class="btn btn-success"
                  :disabled="showResult"
                >
                  Помню
                </button>
              </div>
            </div>

            <div v-if="showResult" class="result-message">
              <div v-if="isCorrect" class="result-correct">
                ✅ Правильно! {{ currentWord.translation }}
              </div>
              <div v-else class="result-incorrect">
                ❌ Неправильно. Правильный ответ: {{ currentWord.translation }}
              </div>
              <button @click="nextQuestion" class="btn btn-primary btn-full">
                {{ currentIndex + 1 === words.length ? 'Завершить' : 'Следующий вопрос' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="completed" class="training-results card">
          <h1 class="title">Тренировка завершена! 🎉</h1>
          <div class="results-stats">
            <div class="result-stat">
              <div class="result-value">{{ correctCount }}</div>
              <div class="result-label">Правильных ответов</div>
            </div>
            <div class="result-stat">
              <div class="result-value">{{ Math.round((correctCount / words.length) * 100) }}%</div>
              <div class="result-label">Точность</div>
            </div>
            <div class="result-stat">
              <div class="result-value">+{{ sessionData?.xpEarned || 0 }}</div>
              <div class="result-label">Опыт (XP)</div>
            </div>
          </div>
          <div class="results-actions">
            <router-link to="/dashboard" class="btn btn-secondary">
              На главную
            </router-link>
            <button @click="restartTraining" class="btn btn-primary">
              Еще раз
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWordsStore } from '../stores/words';
import { useAuthStore } from '../stores/auth';
import AppHeader from '../components/AppHeader.vue';

const route = useRoute();
const router = useRouter();
const wordsStore = useWordsStore();
const authStore = useAuthStore();

const trainingType = ref(route.params.type || 'translation');
const words = ref([]);
const started = ref(false);
const completed = ref(false);
const currentIndex = ref(0);
const selectedAnswer = ref(null);
const userAnswer = ref('');
const showResult = ref(false);
const isCorrect = ref(false);
const answers = ref([]);
const sessionData = ref(null);

const wordsPerTraining = ref(10);

const currentWord = computed(() => words.value[currentIndex.value]);

const trainingTypeName = computed(() => {
  const types = {
    translation: 'Выбор перевода',
    writing: 'Написание',
    spaced: 'Повторение'
  };
  return types[trainingType.value] || 'Тренировка';
});

const trainingDescription = computed(() => {
  const descriptions = {
    translation: 'Выберите правильный перевод слова из предложенных вариантов',
    writing: 'Напишите английское слово по его переводу',
    spaced: 'Повторите изученные слова. Отметьте, помните ли вы перевод'
  };
  return descriptions[trainingType.value] || '';
});

const correctCount = computed(() => {
  return answers.value.filter(a => a === true).length;
});

const options = ref([]);

const generateOptions = (correctWord) => {
  if (trainingType.value !== 'translation') return;

  const allWords = [...words.value];
  const wrongOptions = allWords
    .filter(w => w._id !== correctWord._id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => ({ translation: w.translation, isCorrect: false }));

  const correctOption = {
    translation: correctWord.translation,
    isCorrect: true
  };

  options.value = [...wrongOptions, correctOption].sort(() => Math.random() - 0.5);
};

const startTraining = async () => {
  words.value = await wordsStore.fetchRandomWords(wordsPerTraining.value);
  if (words.value.length === 0) {
    alert('Не удалось загрузить слова. Попробуйте позже.');
    router.push('/dashboard');
    return;
  }
  started.value = true;
  if (trainingType.value === 'translation') {
    generateOptions(currentWord.value);
  }
};

const selectAnswer = (correct) => {
  if (showResult.value) return;
  
  selectedAnswer.value = correct;
  isCorrect.value = correct;
  showResult.value = true;
  answers.value.push(correct);
};

const checkWritingAnswer = () => {
  if (!userAnswer.value) return;
  
  const correct = userAnswer.value.toLowerCase().trim() === currentWord.value.word.toLowerCase();
  isCorrect.value = correct;
  showResult.value = true;
  answers.value.push(correct);
};

const nextQuestion = async () => {
  if (currentIndex.value + 1 < words.value.length) {
    currentIndex.value++;
    selectedAnswer.value = null;
    userAnswer.value = '';
    showResult.value = false;
    
    if (trainingType.value === 'translation') {
      generateOptions(currentWord.value);
    }
  } else {
    await completeTraining();
  }
};

const completeTraining = async () => {
  try {
    const result = await wordsStore.completeTraining(
      words.value,
      answers.value,
      trainingType.value
    );
    sessionData.value = result.session;
    completed.value = true;
  } catch (error) {
    console.error('Ошибка завершения тренировки:', error);
    alert('Ошибка при сохранении результатов');
  }
};

const restartTraining = () => {
  started.value = false;
  completed.value = false;
  currentIndex.value = 0;
  selectedAnswer.value = null;
  userAnswer.value = '';
  showResult.value = false;
  answers.value = [];
  words.value = [];
  sessionData.value = null;
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
});
</script>

<style lang="scss" scoped>
.training-page {
  min-height: 100vh;
  padding-bottom: 40px;
}

.training-content {
  padding-top: 32px;
  max-width: 800px;
  margin: 0 auto;
}

.training-start {
  text-align: center;
}

.title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
}

.description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
}

.training-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  justify-content: space-around;
  gap: 16px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.info-value {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.training-question {
  margin-top: 24px;
}

.question-header {
  margin-bottom: 32px;
}

.progress-info {
  text-align: center;
  color: var(--text-light);
  margin-bottom: 8px;
  font-weight: 600;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 4px;
  transition: width 0.3s;
}

.question-content {
  text-align: center;
}

.word-display {
  margin-bottom: 32px;
}

.word {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 8px;
}

.translation {
  font-size: 32px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
}

.transcription {
  font-size: 18px;
  color: var(--text-light);
  font-style: italic;
}

.question-text {
  font-size: 18px;
  color: var(--text);
  margin-bottom: 24px;
  font-weight: 600;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.option-btn {
  padding: 16px 24px;
  background: white;
  border: 2px solid var(--border);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  transition: all 0.2s;

  &:hover:not(:disabled) {
    border-color: var(--primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }

  &.selected {
    border-color: var(--primary);
    background: rgba(102, 126, 234, 0.1);
  }

  &.correct {
    background: var(--success);
    color: white;
    border-color: var(--success);
  }

  &.incorrect {
    background: var(--error);
    color: white;
    border-color: var(--error);
  }

  &:disabled {
    cursor: not-allowed;
  }
}

.answer-input {
  margin-bottom: 16px;
  font-size: 18px;
  text-align: center;
  text-transform: lowercase;
}

.spaced-options {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.result-message {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
}

.result-correct {
  background: rgba(16, 185, 129, 0.1);
  color: var(--success);
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 16px;
}

.result-incorrect {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  margin-bottom: 16px;
}

.training-results {
  text-align: center;
  margin-top: 24px;
}

.results-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 32px 0;
}

.result-stat {
  .result-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 8px;
  }

  .result-label {
    font-size: 14px;
    color: var(--text-light);
  }
}

.results-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}
</style>

