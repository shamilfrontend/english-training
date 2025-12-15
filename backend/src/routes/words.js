import express from 'express';
import {
  getWords,
  getRandomWord,
  getCategories,
  getWordsCount,
} from '../controllers/wordController.js';

const router = express.Router();

router.get('/', getWords);
router.get('/random', getRandomWord);
router.get('/categories', getCategories);
router.get('/count', getWordsCount);

export default router;

