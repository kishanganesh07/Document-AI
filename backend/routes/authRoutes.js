import express from 'express';
import { register } from '../controller/registerController.js';
import { login } from '../controller/loginController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;
