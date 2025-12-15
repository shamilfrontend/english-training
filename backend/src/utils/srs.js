// Модифицированный алгоритм SM-2 для интервального повторения
export function calculateNextReview(quality, currentInterval, easeFactor) {
  // quality: 0-5 (0=полностью забыл, 5=легко вспомнил)
  // currentInterval: текущий интервал в днях
  // easeFactor: фактор легкости (обычно 2.5)

  let newEaseFactor = easeFactor;
  let newInterval = currentInterval;

  // Обновляем easeFactor
  newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    // Неправильный ответ - начинаем заново
    newInterval = 1;
  } else {
    // Правильный ответ
    if (currentInterval === 0) {
      newInterval = 1;
    } else if (currentInterval === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReview: nextReviewDate,
  };
}

export function getStatusFromQuality(quality, currentStatus) {
  if (quality >= 4) {
    if (currentStatus === 'new') return 'learning';
    if (currentStatus === 'learning') return 'review';
    // Если правильный ответ на слово со статусом review, переводим в mastered
    if (currentStatus === 'review') return 'mastered';
    return 'mastered';
  }
  if (quality < 3) {
    // Если ошибка в повторении изученного слова, возвращаем в learning
    if (currentStatus === 'review' || currentStatus === 'mastered') {
      return 'learning';
    }
    return 'learning';
  }
  return currentStatus;
}

