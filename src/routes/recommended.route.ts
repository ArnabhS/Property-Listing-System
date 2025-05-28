import { Router } from 'express';
import {
  recommendProperty,
  getRecommendations,
  removeRecommendation
} from '../controllers/recommendation.controller.js';
import { cacheMiddleware } from '../middlewares/cache.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();


router.post('/', protect, recommendProperty);
router.post('/remove', protect, removeRecommendation);
router.get('/:userId', protect, cacheMiddleware(3600), getRecommendations);

export default router; 