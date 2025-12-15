import express from 'express';
import {
  getWords,
  getRandomWord,
  getCategories,
} from '../controllers/wordController.js';

const router = express.Router();

router.get('/', getWords);
router.get('/random', getRandomWord);
router.get('/categories', getCategories);

export default router;

