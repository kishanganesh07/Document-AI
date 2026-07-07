import express from 'express';
import multer from 'multer';
import { processPrompt } from '../controller/generateController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// You can add verifyToken middleware here if you want to protect the route
router.post('/', upload.single('document'), processPrompt);

export default router;
