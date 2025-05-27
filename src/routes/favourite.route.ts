import { Router } from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites
} from '../controllers/favourite.controller';
import { cacheMiddleware } from '../middlewares/cache.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();


router.post('/add', protect, addToFavorites);
router.post('/remove', protect, removeFromFavorites);
router.get('/', protect,cacheMiddleware(3600), getFavorites);

export default router; 