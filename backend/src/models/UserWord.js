import mongoose from 'mongoose';

const userWordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true,
    index: true
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  nextReview: {
    type: Date,
    default: Date.now
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalAnswers: {
    type: Number,
    default: 0
  },
  isLearned: {
    type: Boolean,
    default: false
  },
  lastReviewed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Составной индекс для быстрого поиска
userWordSchema.index({ userId: 1, wordId: 1 }, { unique: true });
userWordSchema.index({ userId: 1, nextReview: 1 });
userWordSchema.index({ userId: 1, isLearned: 1 });

export default mongoose.model('UserWord', userWordSchema);

