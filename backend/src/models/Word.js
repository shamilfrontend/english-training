import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  english: String,
  translation: String,
});

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    index: true,
  },
  translation: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'general',
      'pronouns',
      'body',
      'appearance',
      'character',
      'family',
      'clothing',
      'life',
      'food',
      'professions',
      'home',
      'sports',
      'travel',
      'qualities',
      'colors',
      'properties',
      'time',
      'cardinal',
      'ordinal',
      'weather',
      'landscape',
      'animals',
      'plants',
      'holidays',
      'places',
      'conjunctions',
      'prepositions',
    ],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  examples: [exampleSchema],
  imageUrl: {
    type: String,
  },
});

wordSchema.index({ category: 1 });
wordSchema.index({ word: 1 });

export default mongoose.model('Word', wordSchema);

