import express from 'express';
import { authController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/me', requireAuth, (req, res) => authController.getMe(req, res));

export default router;
