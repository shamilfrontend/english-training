// Алгоритм spaced repetition для определения следующей даты повторения
export function calculateNextReview(level, correct) {
  const intervals = {
    0: 1,   // 1 день
    1: 2,   // 2 дня
    2: 4,   // 4 дня
    3: 8,   // 8 дней
    4: 16,  // 16 дней
    5: 32   // 32 дня
  };

  let newLevel = level;
  
  if (correct) {
    newLevel = Math.min(level + 1, 5);
  } else {
    newLevel = Math.max(level - 1, 0);
  }

  const days = intervals[newLevel];
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + days);

  return {
    level: newLevel,
    nextReview,
    isLearned: newLevel >= 4
  };
}

