import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now,
    index: true
  },
  wordsStudied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word'
  }],
  score: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  trainingType: {
    type: String,
    enum: ['translation', 'writing', 'listening', 'sentence', 'spaced'],
    default: 'translation'
  },
  xpEarned: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

sessionSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Session', sessionSchema);

