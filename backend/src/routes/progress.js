import express from 'express';
import {
  getProgress,
  updateProgress,
  getCategoryProgress,
} from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getProgress);
router.get('/categories/:category', authenticateToken, getCategoryProgress);
router.put('/:wordId', authenticateToken, updateProgress);

export default router;

