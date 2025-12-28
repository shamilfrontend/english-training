<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import * as echarts from 'echarts';

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
const chartContainer = ref(null);
let chartInstance = null;

const loadData = async () => {
  loading.value = true;

  const progressResult = await progressStore.fetchProgress();
  if (progressResult.success) {
    stats.value = progressStore.getStats();
  }

  const wordsCountResult = await wordsStore.getWordsCount();
  if (wordsCountResult.success) {
    totalWords.value = wordsCountResult.count;
  }

  loading.value = false;

  // Инициализируем график после загрузки данных и рендера
  await nextTick();
  setTimeout(() => {
    initChart();
  }, 100);
};

const learnedWords = computed(() => stats.value.mastered + stats.value.learning + stats.value.review);

const progressPercent = computed(() => {
  if (totalWords.value === 0) return 0;
  return Math.round((learnedWords.value / totalWords.value) * 100);
});

const getMonthlyStats = () => {
  const progress = progressStore.progress || [];
  const currentYear = new Date().getFullYear();
  
  // Создаем структуру для всех месяцев текущего года
  const monthlyData = {};
  
  // Инициализируем все месяцы текущего года
  for (let month = 0; month < 12; month += 1) {
    const date = new Date(currentYear, month, 1);
    const monthKey = `${currentYear}-${String(month + 1).padStart(2, '0')}`;
    const monthLabel = date.toLocaleDateString('ru-RU', { year: 'numeric', month: 'short' });
    
    monthlyData[monthKey] = {
      label: monthLabel,
      words: new Set(),
      date,
    };
  }

  // Заполняем данными из прогресса
  progress.forEach((item) => {
    if (item.lastPracticed) {
      const date = new Date(item.lastPracticed);
      
      // Проверяем валидность даты и что это текущий год
      if (Number.isNaN(date.getTime()) || date.getFullYear() !== currentYear) {
        return;
      }

      const monthKey = `${currentYear}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      // Добавляем слово в множество для этого месяца, если оно изучено
      const wordId = item.wordId?._id || item.wordId;
      if (item.status !== 'new' && wordId && monthlyData[monthKey]) {
        monthlyData[monthKey].words.add(wordId.toString());
      }
    }
  });

  // Сортируем по дате и считаем накопительный прогресс
  const sortedMonths = Object.values(monthlyData).sort((a, b) => a.date - b.date);
  let cumulativeCount = 0;

  const labels = [];
  const values = [];

  sortedMonths.forEach((month) => {
    cumulativeCount += month.words.size;
    labels.push(month.label);
    values.push(cumulativeCount);
  });

  return {
    labels,
    values,
  };
};

const initChart = () => {
  if (!chartContainer.value) {
    console.warn('Chart container not found');
    return;
  }

  // Уничтожаем предыдущий экземпляр, если есть
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  try {
    chartInstance = echarts.init(chartContainer.value);

    const monthlyStats = getMonthlyStats();

    // Если нет данных, показываем пустой график с сообщением
    if (monthlyStats.labels.length === 0) {
      const emptyOption = {
        title: {
          text: 'Нет данных для отображения',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 16,
          },
        },
      };
      chartInstance.setOption(emptyOption);
      return;
    }

    const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: monthlyStats.labels,
      axisLabel: {
        color: '#666',
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Количество слов',
      axisLabel: {
        color: '#666',
      },
      nameTextStyle: {
        color: '#666',
      },
    },
    series: [
      {
        name: 'Изучено слов',
        type: 'line',
        smooth: true,
        data: monthlyStats.values,
        itemStyle: {
          color: '#667eea',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
              { offset: 1, color: 'rgba(102, 126, 234, 0.1)' },
            ],
          },
        },
      },
    ],
  };

    chartInstance.setOption(option);

    // Обработка изменения размера окна
    const handleResize = () => {
      if (chartInstance) {
        chartInstance.resize();
      }
    };

    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Error initializing chart:', error);
  }
};

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

          <div class="card">
            <div ref="chartContainer" class="chart-container"></div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '../styles/components.scss';

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

.chart-container {
  width: 100%;
  height: 400px;
}
</style>
