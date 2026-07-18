import express from 'express';
import { register } from '../controller/registerController.js';
import { login } from '../controller/loginController.js';
import { changePassword } from '../controller/changePasswordController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', verifyToken, changePassword);

export default router;
