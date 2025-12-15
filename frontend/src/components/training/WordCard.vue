<template>
  <div class="word-card fade-in">
    <div class="word-card__content">
      <div class="word-card__word-wrapper">
        <h2 class="word-card__word">{{ word.word }}</h2>
        <button
          @click="playWord"
          class="word-card__play-btn"
          :disabled="isPlaying"
          aria-label="Произнести слово"
        >
          <svg
            v-if="!isPlaying"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5V19L19 12L8 5Z"
              fill="currentColor"
            />
          </svg>
          <svg
            v-else
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="6" y="4" width="4" height="16" fill="currentColor" />
            <rect x="14" y="4" width="4" height="16" fill="currentColor" />
          </svg>
        </button>
      </div>
      <p v-if="word.transcription" class="word-card__transcription">
        {{ word.transcription }}
      </p>
      <p class="word-card__question">Выберите правильный перевод:</p>

      <div class="word-card__options">
        <button
          v-for="(option, index) in safeOptions"
          :key="index"
          @click="handleSelect(index)"
          :disabled="selectedIndex !== null"
          :class="[
            'word-card__option',
            {
              'word-card__option--selected': selectedIndex === index,
              'word-card__option--correct':
                selectedIndex !== null && index === safeCorrectIndex,
              'word-card__option--wrong':
                selectedIndex !== null &&
                selectedIndex === index &&
                index !== safeCorrectIndex,
            },
          ]"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="selectedIndex !== null" class="word-card__feedback">
        <div
          v-if="selectedIndex === safeCorrectIndex"
          class="word-card__feedback-message word-card__feedback-message--correct"
        >
          ✓ Правильно!
        </div>
        <div
          v-else
          class="word-card__feedback-message word-card__feedback-message--wrong"
        >
          ✗ Неправильно. Правильный ответ: {{ safeOptions[safeCorrectIndex] }}
        </div>
        <div v-if="word.examples && word.examples.length" class="word-card__examples">
          <p
            v-for="(example, idx) in word.examples"
            :key="idx"
            class="word-card__example"
          >
            <strong>{{ example.english }}</strong><br />
            {{ example.translation }}
          </p>
        </div>
        <button @click="handleContinue" class="btn btn--primary btn--full">
          Продолжить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  word: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  correctIndex: {
    type: Number,
    required: true,
    default: 0,
  },
});

const emit = defineEmits(['answer']);

const selectedIndex = ref(null);
const isPlaying = ref(false);

const safeOptions = computed(() => {
  return props.options && props.options.length > 0 
    ? props.options 
    : [];
});

const safeCorrectIndex = computed(() => {
  return props.correctIndex >= 0 && props.correctIndex < safeOptions.value.length
    ? props.correctIndex
    : 0;
});

// Сбрасываем выбор при смене слова
watch(
  () => props.word._id,
  () => {
    selectedIndex.value = null;
  }
);

const handleSelect = (index) => {
  if (selectedIndex.value !== null) return;
  
  selectedIndex.value = index;
};

const handleContinue = () => {
  if (selectedIndex.value === null) return;
  
  const isCorrect = selectedIndex.value === safeCorrectIndex.value;
  emit('answer', {
    isCorrect,
    selectedIndex: selectedIndex.value,
    correctIndex: safeCorrectIndex.value,
  });
  
  // Сбрасываем выбор после отправки ответа
  selectedIndex.value = null;
};

const playWord = () => {
  if (isPlaying.value || !props.word?.word) return;

  // Проверяем поддержку Web Speech API
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis не поддерживается в этом браузере');
    return;
  }

  isPlaying.value = true;

  // Останавливаем предыдущее воспроизведение, если есть
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(props.word.word);
  
  // Настройки для английского произношения
  utterance.lang = 'en-US';
  utterance.rate = 0.9; // Скорость речи (0.1 - 10)
  utterance.pitch = 1; // Высота голоса (0 - 2)
  utterance.volume = 1; // Громкость (0 - 1)

  // Пытаемся выбрать английский голос
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(
    (voice) => voice.lang.startsWith('en') && voice.localService
  ) || voices.find((voice) => voice.lang.startsWith('en'));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.onend = () => {
    isPlaying.value = false;
  };

  utterance.onerror = () => {
    isPlaying.value = false;
    console.error('Ошибка при воспроизведении слова');
  };

  window.speechSynthesis.speak(utterance);
};

// Загружаем голоса при монтировании компонента
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  // Некоторые браузеры загружают голоса асинхронно
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      // Голоса загружены
    });
  }
}
</script>

<style lang="scss" scoped>
.word-card {
  &__content {
    width: 100%;
  }

  &__word-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  &__word {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  &__play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid var(--primary-color);
    background: var(--bg-white);
    color: var(--primary-color);
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    padding: 0;

    &:hover:not(:disabled) {
      background: var(--primary-color);
      color: white;
      transform: scale(1.1);
      box-shadow: var(--shadow-md);
    }

    &:active:not(:disabled) {
      transform: scale(0.95);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__transcription {
    font-size: 1.25rem;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  &__question {
    font-size: 1.125rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  &__options {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__option {
    padding: 1rem 1.5rem;
    font-size: 1.125rem;
    text-align: left;
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-white);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
    min-height: 56px; // Для touch-интерфейса

    &:hover:not(:disabled) {
      border-color: var(--primary-color);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    &:disabled {
      cursor: not-allowed;
    }

    &--selected {
      border-color: var(--primary-color);
      background: rgba(102, 126, 234, 0.1);
    }

    &--correct {
      border-color: var(--success-color);
      background: rgba(16, 185, 129, 0.1);
      color: var(--success-color);
      font-weight: 600;
    }

    &--wrong {
      border-color: var(--error-color);
      background: rgba(239, 68, 68, 0.1);
      color: var(--error-color);
    }
  }

  &__feedback {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 2px solid var(--border-color);
  }

  &__feedback-message {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: var(--radius-md);

    &--correct {
      color: var(--success-color);
      background: rgba(16, 185, 129, 0.1);
    }

    &--wrong {
      color: var(--error-color);
      background: rgba(239, 68, 68, 0.1);
    }
  }

  &__examples {
    margin-top: 1rem;
    text-align: left;
  }

  &__example {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
  }
}
</style>
