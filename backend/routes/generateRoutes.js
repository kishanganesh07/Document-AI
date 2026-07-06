import express from 'express';
import { processPrompt } from '../controller/generateController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// You can add verifyToken middleware here if you want to protect the route
router.post('/', processPrompt);

export default router;
