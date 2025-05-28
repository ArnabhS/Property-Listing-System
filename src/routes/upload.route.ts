import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { importProperties } from '../controllers/upload.controller.js';

const router = express.Router();

router.post('/properties', protect, upload.single('file'), importProperties);

export default router;