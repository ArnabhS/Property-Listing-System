import { Router } from 'express';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties
} from '../controllers/property.controller';
import { cacheMiddleware } from '../middlewares/cache.middleware';
import { protect } from '../middlewares/auth.middleware';

const router = Router();


router.post('/create', protect, createProperty);
router.put('/update/:id', protect, updateProperty);
router.delete('/:id', protect, deleteProperty);
router.get('/search', cacheMiddleware(3600), searchProperties);

export default router; 