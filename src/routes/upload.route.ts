import express from 'express';
import { protect } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/multer.middleware';
import { importProperties } from '../controllers/upload.controller';

const router = express.Router();

router.post('/properties', protect, upload.single('file'), importProperties);

export default router;