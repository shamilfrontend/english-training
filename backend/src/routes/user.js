import express from 'express';
import {
  getProgress,
  markWordLearned,
  completeTraining,
  updateSettings
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // Все маршруты требуют аутентификации

router.get('/progress', getProgress);
router.post('/words/:wordId/learn', markWordLearned);
router.post('/training', completeTraining);
router.put('/settings', updateSettings);

export default router;

