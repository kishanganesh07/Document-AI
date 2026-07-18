import express from 'express';
import { 
  getDocuments, 
  getDocumentById, 
  createDocument, 
  updateDocument, 
  deleteDocument,
  getDashboardStats 
} from '../controller/documentController.js';

const router = express.Router();

router.get('/stats', getDashboardStats); // Must come before /:id
router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export default router;
