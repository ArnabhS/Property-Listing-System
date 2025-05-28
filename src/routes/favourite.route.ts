import { Router } from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../controllers/favourite.controller.js';
import { cacheMiddleware } from '../middlewares/cache.middleware.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();


router.post('/add', protect, addToFavorites);
router.post('/remove', protect, removeFromFavorites);
router.get('/', protect,cacheMiddleware(3600), getFavorites);

export default router; 