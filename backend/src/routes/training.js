import express from 'express';
import {
  getDailyTraining,
  getReviewWords,
  completeTraining,
} from '../controllers/trainingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', authenticateToken, getDailyTraining);
router.get('/review', authenticateToken, getReviewWords);
router.post('/complete', authenticateToken, completeTraining);

export default router;

