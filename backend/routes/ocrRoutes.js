import express from 'express';
import multer from 'multer';
import { runOCR } from '../controller/ocrController.js';

const router = express.Router();

// Configure multer to store uploaded files in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB max size
  }
});

// Setup the OCR route
router.post('/', upload.single('file'), runOCR);

export default router;
