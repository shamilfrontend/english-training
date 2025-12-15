import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    // index: true
  },
  translation: {
    type: String,
    required: true
  },
  transcription: {
    type: String,
    default: ''
  },
  example: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'general',
    index: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
    index: true
  }
});

wordSchema.index({ word: 1 });
wordSchema.index({ category: 1, difficulty: 1 });

export default mongoose.model('Word', wordSchema);
