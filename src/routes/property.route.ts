import { Router } from 'express';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties
} from '../controllers/property.controller';

const router = Router();

// Property CRUD routes
router.post('/', createProperty);

// Favorites routes
router.put('/update/:id', updateProperty);
router.delete('/:id', deleteProperty);
router.get('/search', searchProperties);

export default router; 