import { Router } from 'express';
import {
  recommendProperty,
  getRecommendations,
  removeRecommendation
} from '../controllers/recommendation.controller';
import { cacheMiddleware } from '../middlewares/cache.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();


router.post('/', protect, recommendProperty);
router.post('/remove', protect, removeRecommendation);
router.get('/:userId', protect, cacheMiddleware(3600), getRecommendations);

export default router; 