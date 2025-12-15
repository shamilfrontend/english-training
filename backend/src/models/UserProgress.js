import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['new', 'learning', 'review', 'mastered'],
    default: 'new',
  },
  nextReview: {
    type: Date,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  wrongAnswers: {
    type: Number,
    default: 0,
  },
  lastPracticed: {
    type: Date,
  },
  interval: {
    type: Number,
    default: 1, // дни до следующего повторения
  },
  easeFactor: {
    type: Number,
    default: 2.5, // для алгоритма SM-2
  },
});

userProgressSchema.index({ userId: 1, wordId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ userId: 1, nextReview: 1 });

export default mongoose.model('UserProgress', userProgressSchema);

