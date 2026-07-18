import express from 'express';
import { 
  getDocuments, 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  getDashboardStats 
} from '../controller/documentController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/stats', verifyToken, getDashboardStats); // Must come before /:id
router.get('/', verifyToken, getDocuments);
router.get('/:id', verifyToken, getDocumentById);
router.post('/', verifyToken, createDocument);
router.put('/:id', verifyToken, updateDocument);
router.delete('/:id', verifyToken, deleteDocument);

export default router;
