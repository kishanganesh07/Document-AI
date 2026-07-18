import express from 'express';
import { runWorkflowPipeline } from '../controller/workflowController.js';

const router = express.Router();

// POST /api/workflows/run
router.post('/run', runWorkflowPipeline);

export default router;
