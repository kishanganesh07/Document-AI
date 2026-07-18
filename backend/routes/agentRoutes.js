import express from 'express';
import multer from 'multer';
import { runAgentWorkflow } from '../controller/agentController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Accept optional file upload (field name: 'document')
router.post('/run', upload.single('document'), runAgentWorkflow);

export default router;
