import express from 'express';
import { getWords, getRandomWords, getWordById } from '../controllers/wordsController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getWords);
router.get('/random', authenticate, getRandomWords);
router.get('/:id', getWordById);

export default router;

